import { Router } from 'express';
import { generateImage } from '../../controllers/image';
import { verifyToken } from '../../middlewares/verifyToken';
import { limiter } from '../../middlewares/rateLimit';
const router = Router();

router.use(verifyToken);
router.use(limiter);

router.post('/generate-image', generateImage);

export default router;