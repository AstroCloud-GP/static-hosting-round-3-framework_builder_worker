import { Request, Response } from 'express';
import { createUser, getUserById } from '../models/User';

/**
 * Controller to handle the request for getting a user by their ID.
 * 
 * @returns A JSON response with the user data if found, otherwise a 404 status with an error message.
 */
export async function getUserByIdController(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

/**
 * Creates a new user and returns the user's ID.
 *
 * @returns A JSON response with the newly created user's ID.
 */
export async function createUserController(req: Request, res: Response) {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.json({ id: user.id });
}
