import express from 'express';
import * as reviewController from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

export default router;
