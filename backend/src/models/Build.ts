import { Build, Project } from "@prisma/client";
import { prisma } from "../prisma";

export async function getBuild(projectId: number, buildNumber: number): Promise<Build | null> {
    return prisma.build.findFirst({
        where: {
            project_id: projectId,
            build_number: buildNumber
        }
    })
}

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