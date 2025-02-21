import { Build, Project, User } from "@prisma/client";
import { prisma } from "./prisma";
import { ProjectConfig, ProjectCreateDTO } from "../../../shared-code/project";

/**
 * Retrieves a project by its ID, including environment variables
 * @param id - The ID of the project to retrieve
 * @returns Promise that resolves to the project with its configuration
 */
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
    
/**
 * Creates a new project in the database
 * @param projectData - The project creation data including owner and configuration
 * @returns Promise that resolves to the created project
 */
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

/**
 * Retrieves all builds associated with a project
 * @param projectId - The ID of the project
 * @returns Promise that resolves to an array of builds or null if project not found
 */
export async function getProjectBuilds(projectId: number): Promise<Build[] | null> {
    return await prisma.project.findUnique({
        where: {
            id: projectId
        }
    }).builds()
}