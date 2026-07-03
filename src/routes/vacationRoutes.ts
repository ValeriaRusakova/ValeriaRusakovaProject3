import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { addVacation, editVacation, listVacations, removeVacation, vacationById } from '../controllers/vacationController';
import { authenticateJwt, requireRole } from '../middleware/auth';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.use(authenticateJwt);

router.get('/', listVacations);
router.get('/:id', vacationById);
router.post('/', requireRole('admin'), upload.single('image'), addVacation);
router.put('/:id', requireRole('admin'), upload.single('image'), editVacation);
router.delete('/:id', requireRole('admin'), removeVacation);

export default router;
