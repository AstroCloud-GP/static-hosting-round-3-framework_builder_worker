import { Router } from 'express';
import { createUserController, getUserByIdController } from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/:id', getUserByIdController);
userRouter.post('/', createUserController);

export default userRouter;