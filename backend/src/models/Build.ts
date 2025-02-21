import { Build, Project } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Retrieves a specific build for a project
 * @param projectId - The ID of the project
 * @param buildNumber - The build number to retrieve
 * @returns Promise that resolves to the Build if found, null otherwise
 */
export async function getBuild(projectId: number, buildNumber: number): Promise<Build | null> {
    return prisma.build.findFirst({
        where: {
            project_id: projectId,
            build_number: buildNumber
        }
    })
}

/**
 * Creates a new build for a project with an incremented build number
 * @param projectId - The ID of the project to create a build for
 * @returns Promise that resolves to the newly created Build
 */
export async function createBuild(projectId: number): Promise<Build> {

    const lastBuild = await prisma.build.findFirst({
        where: {
            project_id: projectId
        },
        orderBy: {
            build_number: 'desc'
        }
    })

    return prisma.build.create({
        data: {
            project_id: projectId,
            build_number: lastBuild ? lastBuild.build_number + 1 : 1
        }
    })
}

/**
 * Updates the status and logs of an existing build
 * @param projectId - The ID of the project
 * @param buildNum - The build number to update
 * @param status - The new status of the build ("SUCCESS" or "FAIL")
 * @param logs - The build logs to store
 * @returns Promise that resolves to the updated Build
 */
export async function updateBuild(projectId: number, buildNum: number, status: "SUCCESS" | "FAIL", logs: string): Promise<Build> {
    return await prisma.build.update({
        where: {
            project_id_build_number: {
                project_id: projectId,
                build_number: buildNum
            }
        },
        data: {
            build_status: status,
            logs,
        }
    })
}