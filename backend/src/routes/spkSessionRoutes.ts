import express from 'express';
import * as spkSessionController from '../controllers/spkSessionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, spkSessionController.createSession);
router.get('/:sessionId', authMiddleware, spkSessionController.getSession);

export default router;