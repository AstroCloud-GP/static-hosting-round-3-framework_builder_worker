import { Processor } from "bullmq";
import { BuildJob } from "../../shared-code/queues";
import { buildResultQueue } from "./queues";
import fs from "fs";
import { execSync } from "child_process";
import { AzureService } from "./azure";
import path from "path";

/**
 * Processes build jobs from the queue
 * @param job The build job to process
 */
export const buildJobProcessor: Processor<BuildJob> = async (job) => {
    console.log(`Building project ${job.data.project_id} with build number ${job.data.build_number}`);

    const { status, logs } = await buildJob(job.data);

    await buildResultQueue.add(`event-${job.data.project_id}-${job.data.build_number}`, {
        project_id: job.data.project_id,
        build_number: job.data.build_number,
        status,
        logs
    })

}

/**
 * Executes a build job for a given project, including cloning the repository, 
 * running build commands, and uploading the build output to an Azure container.
 * 
 * @param {BuildJob} data - The build job data containing project configuration and details.
 * 
 * @throws Will throw an error if any step in the build process fails.
 * 
 * The function performs the following steps:
 * 1. Creates a working directory for the build process.
 * 2. Runs a Docker container to perform the build.
 * 3. Clones the project repository from GitHub.
 * 4. Installs npm dependencies if a build command is specified.
 * 5. Executes the build command.
 * 6. Copies the build output to the working directory.
 * 7. Uploads the build output to an Azure container.
 * 8. Cleans up the Docker container and working directory.
 */
async function buildJob(data: BuildJob): Promise<{
    status: "SUCCESS" | "FAIL",
    logs: string,
}> {
    
    const workFolder = path.join(process.cwd(), 'temp', data.project_id + '')
    
    /**
     * Cumulative logs for the entire build process
     */
    let cumLogs = "";

    /**
     * Logs for each step in the build process
     * to be appended to the cumulative logs
     */
    let logs = "";

    try {

        // check if working directory exists
        if (!fs.existsSync(workFolder)) {
            fs.mkdirSync(workFolder, { recursive: true });
        }

        // create a docker container        
        logs = execSync(`docker run --rm --name ${data.container_name} -itd -v ${workFolder}:/output -w /app timbru31/node-alpine-git:22 sh`).toString();
        console.log("Docker run logs: ", logs);
        cumLogs += logs;

        // clone the repository
        logs = execSync(`docker exec ${data.container_name} git clone --single-branch --branch ${data.project_config.branch || 'main'} --depth 1 ${data.github_url} .`).toString();
        console.log("Git clone logs: ", logs);
        cumLogs += logs;

        if(data.project_config.buildCommand) {
            // if build command is specified, install npm dependencies
            logs = execSync(`docker exec ${data.container_name} sh -c "cd /app && npm install --force"`).toString();
            console.log("Npm install logs: ", logs);
            cumLogs += logs;
        }

        // execute build command in the container inside specified root directory
        logs = execSync(`docker exec ${data.container_name} sh -c "cd /app/${data.project_config.rootDir || ''} && ${data.project_config.buildCommand || 'echo "No build command specified"'}"`).toString();
        console.log("Build command logs: ", logs);
        cumLogs += logs;

        // copy the build output to the mounted volume path
        logs = execSync(`docker exec ${data.container_name} cp -r ./${data.project_config.outputDir? data.project_config.outputDir + '/' : ''} /output`).toString();
        console.log("Copy output logs: ", logs);
        cumLogs += logs;

        console.log("Finished building the application.")

        const containerName = data.container_name;
        console.log("Checking if container exists...")
        
        if(await AzureService.doesContainerExist(containerName)) {
            // if container exists with the same name, empty it
            console.log("Container already exists. Emptying...")
            await AzureService.emptyContainer(containerName)
            console.log("Container emptied")
        } else {
            // else create a new container
            console.log("Creating container...")
            await AzureService.createContainer(containerName)
        }

        // read everything in the output directory and filter out only files
        const files = fs.readdirSync(workFolder, {
            withFileTypes: true,
            recursive: true
        }).filter(item => item.isFile())
        
        // upload each file to the container with the same directory structure
        for await (let file of files) {
            const filePath = path.join(file.parentPath, file.name)
            const fileBuffer = fs.readFileSync(filePath)

            // get relative path of file from output directory
            let fileNameWithDirectory = path.relative(workFolder, filePath)

            // skip .git directory
            if(fileNameWithDirectory.startsWith('.git')) {
                continue
            }

            // remove outputDir prefix if present
            if(data.project_config.outputDir && fileNameWithDirectory.startsWith(data.project_config.outputDir)) {
                fileNameWithDirectory = fileNameWithDirectory.slice(data.project_config.outputDir.length+1)
            }

            console.log(fileNameWithDirectory)

            // upload file to container
            await AzureService.uploadToContainer(containerName, fileNameWithDirectory, fileBuffer)
        }

        console.log("Files uploaded successfully")

        return {
            status: "SUCCESS",
            logs: cumLogs
        }
    } catch (e) {
        console.error("Error occurred in building process: ", e)
        return {
            status: "FAIL",
            logs: cumLogs + e,
        }
    } finally {
        // cleanup container
        try {
            // stop the container. It will be automatically removed due to --rm flag
            execSync(`docker stop ${data.container_name}`);
        } catch (e) {
            console.error("Error occurred in stopping container: ", e)
        }           

        // cleanup working directory
        fs.rmdirSync(workFolder, { recursive: true });
    }

}
