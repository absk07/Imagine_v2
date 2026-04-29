import { Router } from 'express';
import { registerUser, loginUser, unknownCredit } from '../../controllers/user';
import { verifyToken } from '../../middlewares/verifyToken';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/unknown-credit', verifyToken, unknownCredit);

export default router;