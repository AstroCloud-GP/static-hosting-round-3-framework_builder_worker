import { Router } from 'express';
import * as fs from 'fs';
import userRouter from './user.routes';
import projectRouter from './project.routes';
import authRouter from './auth.routes';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/project', projectRouter);
mainRouter.use('/auth', authRouter);
export default mainRouter;
