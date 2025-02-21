import { Router } from "express";
import userRouter from "./user.routes";
import projectRouter from "./project.routes";

const mainRouter = Router();

mainRouter.use('/user', userRouter)
mainRouter.use('/project', projectRouter)

export default mainRouter;