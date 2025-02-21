import { Build, Project, User } from "@prisma/client";
import { prisma } from "./prisma";
import { ProjectConfig, ProjectCreateDTO } from "../../../shared-code/project";

export async function getProjectById(id: number) {
    return await prisma.project.findUnique({
        where: {
            id
        },
        include: {
            config_env_vars: true
        }
    })
}

interface ProjectData extends ProjectCreateDTO {
    ownerId: number
}
    

export async function createProject(projectData: ProjectData): Promise<Project> {
    return await prisma.project.create({
        data: {
            name: projectData.name,
            token: projectData.token,
            repository_url: projectData.repository_url,
            config_branch: projectData.config.branch,
            config_build_command: projectData.config.buildCommand,
            config_out_dir: projectData.config.outputDir,
            config_root_dir: projectData.config.rootDir,
            config_env_vars: {
                createMany: {
                    data: Object.entries(projectData.config.environment ?? []).map(([key, value]) => ({
                        key,
                        value
                    }))
                }
            },
            ownerId: projectData.ownerId,
            container_name: `${Date.now()}-${projectData.name}`
        }
    })
}

export async function getProjectBuilds(projectId: number): Promise<Build[] | null> {
    return await prisma.project.findUnique({
        where: {
            id: projectId
        }
    }).builds()
}