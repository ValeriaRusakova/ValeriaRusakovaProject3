import { Router } from 'express';
import { answerMcpQuestion } from '../controllers/mcpController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);
router.post('/question', answerMcpQuestion);

export default router;
