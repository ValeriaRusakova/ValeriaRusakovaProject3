import { Router } from 'express';
import { getRecommendation } from '../controllers/aiController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);
router.post('/', getRecommendation);
router.post('/recommendation', getRecommendation);

export default router;
