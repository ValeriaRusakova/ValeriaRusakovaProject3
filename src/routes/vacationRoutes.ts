import { Router } from 'express';
import { addVacation, editVacation, listVacations, removeVacation, vacationById } from '../controllers/vacationController';
import { authenticateJwt, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', listVacations);
router.get('/:id', vacationById);
router.post('/', requireRole('admin'), addVacation);
router.put('/:id', requireRole('admin'), editVacation);
router.delete('/:id', requireRole('admin'), removeVacation);

export default router;
