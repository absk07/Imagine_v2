import { Router } from 'express';
const router = Router();
import userRoutes from './user';
import iamgeRoutes from './genImg';
import historyRoutes from './history';

router.use('/user', userRoutes);
router.use('/text-to-image', iamgeRoutes);
router.use('/history', historyRoutes);

export default router;