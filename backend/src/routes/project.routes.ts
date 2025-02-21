import { Router } from 'express';
import { 
    createBuildController, 
    createProjectController, 
    getProjectBuildsController, 
    getProjectHomeController 
} from '../controllers/project.controller';

const projectRouter = Router();

projectRouter.get('/', getProjectHomeController);
projectRouter.post('/new', createProjectController);
projectRouter.post('/:id/build', createBuildController);
projectRouter.get('/:id/builds', getProjectBuildsController);

export default projectRouter;