import { Router } from 'express';
import { getAllHistory, getHistory, editHistory, deleteHistory } from '../../controllers/history';
import { verifyToken } from '../../middlewares/verifyToken';
const router = Router();

router.use(verifyToken);

router.get('/', getAllHistory);
router.get('/:id', getHistory);
router.put('/:id', editHistory);
router.delete('/:id', deleteHistory);

export default router;