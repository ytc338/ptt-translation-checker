import { Router } from 'express';
import proofreadRoutes from './proofreadRoutes';

const apiRouter = Router();

apiRouter.use('/proofread', proofreadRoutes); // Changed to '/proofread' to match frontend request

export default apiRouter;
