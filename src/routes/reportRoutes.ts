import { Router } from 'express';
import { vacationsLikesCsv, vacationsLikesReport } from '../controllers/reportController';
import { authenticateJwt, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt, requireRole('admin'));
router.get('/vacations-likes', vacationsLikesReport);
router.get('/vacations-csv', vacationsLikesCsv);

export default router;
