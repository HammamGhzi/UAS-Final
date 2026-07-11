import express from 'express';
import * as recommendationController from '../controllers/recommendationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, recommendationController.createAndRunRecommendation);
router.get('/:sessionId', recommendationController.getRecommendation);

export default router;