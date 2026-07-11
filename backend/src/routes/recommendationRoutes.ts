import express from 'express';
import * as recommendationController from '../controllers/recommendationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, recommendationController.createAndRunRecommendation);
// Publik: dipanggil dari halaman Katalog (SPK dijalankan setelah data awal tampil)
router.post('/run', recommendationController.runPublicRecommendation);
router.get('/:sessionId', recommendationController.getRecommendation);

export default router;