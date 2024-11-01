import { Processor } from "bullmq";
import { BuildJob } from "../../shared-code/queues";
import { buildResultQueue } from "./queues";
import fs from "fs";
import { execSync } from "child_process";
import { AzureService } from "./azure";
import path from "path";

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

async function buildJob(data: BuildJob): Promise<{
    status: "SUCCESS" | "FAIL",
    logs: string,
}> {
    
    const workFolder = path.join(process.cwd(), 'temp', data.project_id + '')
        
    let cumLogs = "";
    let logs = "";

    try {

        // check if working directory exists
        if (!fs.existsSync(workFolder)) {
            fs.mkdirSync(workFolder, { recursive: true });
        }

        logs = execSync(`docker run --rm --name ${data.container_name} -itd -v ${workFolder}:/output -w /app timbru31/node-alpine-git:22 sh`).toString();
        console.log("Docker run logs: ", logs);
        cumLogs += logs;

        logs = execSync(`docker exec ${data.container_name} git clone --single-branch --branch ${data.project_config.branch || 'main'} --depth 1 ${data.github_url} .`).toString();
        console.log("Git clone logs: ", logs);
        cumLogs += logs;

        logs = execSync(`docker exec ${data.container_name} sh -c "cd /app && npm install --force"`).toString();
        console.log("Npm install logs: ", logs);
        cumLogs += logs;

        logs = execSync(`docker exec ${data.container_name} sh -c "cd /app/${data.project_config.rootDir || ''} && ${data.project_config.buildCommand || 'echo "No build command specified"'}"`).toString();
        console.log("Build command logs: ", logs);
        cumLogs += logs;

        logs = execSync(`docker exec ${data.container_name} cp -r ./${data.project_config.outputDir || ''} /output`).toString();
        console.log("Copy output logs: ", logs);
        cumLogs += logs;

        console.log("Finished building the application.")

        const containerName = data.container_name;
        console.log("Checking if container exists...")
        
        if(await AzureService.doesContainerExist(containerName)) {
            console.log("Container already exists. Emptying...")
            await AzureService.emptyContainer(containerName)
            console.log("Container emptied")
        } else {
            console.log("Creating container...")
            await AzureService.createContainer(containerName)
        }

        const files = fs.readdirSync(workFolder, {
            withFileTypes: true,
            recursive: true
        }).filter(item => item.isFile())
        
        for await (let file of files) {
            const filePath = path.join(file.parentPath, file.name)
            const fileBuffer = fs.readFileSync(filePath)
            const fileNameWithDirectory = path.relative(workFolder, filePath)
            console.log(fileNameWithDirectory)
            await AzureService.uploadToContainer(containerName, fileNameWithDirectory, fileBuffer)
        }

        console.log("Files uploaded successfully")

        return {
            status: "SUCCESS",
            logs: cumLogs
        }
    } catch (e) {
        console.error(e)
        return {
            status: "FAIL",
            logs: cumLogs + e,
        }
    } finally {
        // cleanup container
        execSync(`docker stop ${data.container_name}`);

        // cleanup working directory
        fs.rmdirSync(workFolder, { recursive: true });
    }

}