import { Request, Response } from 'express';
import { ProjectCreateDTO } from '../../../shared-code/project';
import { createProject, getProjectById, getProjectBuilds } from '../models/Project';
import { createBuild } from '../models/Build';
import addBuildJob from '../job-queue';

export function getProjectHomeController(req: Request, res: Response) {
    res.json({ message: 'Hello, world!' });
}

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

export async function getProjectBuildsController(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const builds = await getProjectBuilds(id);
    if (builds) {
        res.json(builds);
    } else {
        res.status(404).json({ message: 'Builds not found' });
    }
}
