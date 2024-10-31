import { Project, User } from "@prisma/client"
import { prisma } from "../prisma"

export async function getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany()
}

export function getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

export async function createUser(name: string, email: string): Promise<User> {
    return await prisma.user.create({
        data: {
            name,
            email
        }
    })
}

export async function getUserProjects(id: number): Promise<Project[] | null> {
    return await prisma.user.findUnique({
        where: {
            id
        }
    }).projects()
}