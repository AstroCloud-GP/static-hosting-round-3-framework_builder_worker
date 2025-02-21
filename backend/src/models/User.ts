import { Project, User } from "@prisma/client"
import { prisma } from "./prisma"

/**
 * Retrieves all users from the database
 * @returns Promise that resolves to an array of all users
 */
export async function getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany()
}

/**
 * Retrieves a user by their ID, including their projects
 * @param id - The ID of the user to retrieve
 * @returns Promise that resolves to the user with their projects if found
 */
export function getUserById(id: number) {
    return prisma.user.findUnique({
        where: {
            id
        },
        include: {
            projects: true
        }
    })
}

/**
 * Creates a new user in the database
 * @param name - The name of the user
 * @param email - The email address of the user
 * @returns Promise that resolves to the created user
 */
export async function createUser(name: string, email: string): Promise<User> {
    return await prisma.user.create({
        data: {
            name,
            email
        }
    })
}

/**
 * Retrieves all projects associated with a user
 * @param id - The ID of the user
 * @returns Promise that resolves to an array of projects or null if user not found
 */
export async function getUserProjects(id: number): Promise<Project[] | null> {
    return await prisma.user.findUnique({
        where: {
            id
        }
    }).projects()
}