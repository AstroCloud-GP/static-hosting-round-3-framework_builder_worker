import { Request, Response } from 'express';
import { createUser, getUserById } from '../models/User';

export async function getUserByIdController(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

export async function createUserController(req: Request, res: Response) {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.json({ id: user.id });
}
