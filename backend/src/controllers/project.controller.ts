import { Request, Response } from 'express';
import { ProjectCreateDTO } from '../../../shared-code/project';
import { createProject, getProjectById, getProjectBuilds } from '../models/Project';
import { createBuild } from '../models/Build';
import addBuildJob from '../services/job-queue';

/**
 * Handles the request to get the project home. Used for testing.
 */
export function getProjectHomeController(req: Request, res: Response) {
    res.json({ message: 'Hello, world!' });
}


/**
 * Creates a new project and initiates a build job.
 *
 * This controller function handles the creation of a new project based on the provided
 * request data. It then creates a build associated with the project and adds a build job
 * to the queue with the necessary details.
 *
 * @returns A JSON response containing a success message and the created project ID.
 *
 * @throws Will throw an error if the project creation or build job addition fails.
 */
export async function createProjectController(req: Request, res: Response) {
    const data = req.body as ProjectCreateDTO;
    const project = await createProject(data);
    const build = await createBuild(project.id);

    await addBuildJob({
        build_number: build.build_number,
        project_id: project.id,
        github_token: data.token,
        github_url: data.repository_url,
        project_config: data.config,
        container_name: project.container_name
    });

    res.json({
        message: "Project created successfully. Build job added to queue.",
        projectId: project.id
    });
}

/**
 * Handles the creation of a build for a given project.
 * 
 * This controller function retrieves a project by its ID from the request parameters,
 * creates a build for the project, and adds a build job to the queue with the necessary
 * project configuration and GitHub details.
 * 
 * @returns A JSON response indicating the result of the operation.
 * 
 * @throws Will return a 404 status code if the project is not found.
 */
export async function createBuildController(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const project = await getProjectById(id);

    if (!project) {
        res.status(404).json({
            message: "Project not found."
        });
        return;
    }

    const build = await createBuild(id);

    await addBuildJob({
        build_number: build.build_number,
        project_id: project.id,
        github_token: project.token,
        github_url: project.repository_url,
        project_config: {
            branch: project.config_branch,
            buildCommand: project.config_build_command,
            outputDir: project.config_out_dir,
            rootDir: project.config_root_dir,
            environment: project.config_env_vars.reduce((acc, env) => {
                acc[env.key] = env.value;
                return acc;
            }, {} as { [key: string]: string })
        },
        container_name: project.container_name
    });

    res.json({
        message: "Build job added to queue."
    });
}

/**
 * Controller to handle the request for fetching builds of a specific project.
 * 
 * @returns A JSON response with the builds data if found, otherwise a 404 status with an error message.
 */
export async function getProjectBuildsController(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const builds = await getProjectBuilds(id);
    if (builds) {
        res.json(builds);
    } else {
        res.status(404).json({ message: 'Builds not found' });
    }
}
