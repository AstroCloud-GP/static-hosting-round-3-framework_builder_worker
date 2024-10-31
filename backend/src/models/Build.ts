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

