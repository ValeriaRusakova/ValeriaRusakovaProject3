import { Router } from 'express';
import { addLike, removeLike } from '../controllers/likeController';
import { authenticateJwt, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt, requireRole('user'));
router.post('/:vacationId', addLike);
router.delete('/:vacationId', removeLike);

export default router;
