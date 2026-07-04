import express from 'express';
import * as criteriaController from '../controllers/criteriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', criteriaController.getAllCriteria);
router.get('/:id', criteriaController.getCriteriaById);
router.post('/', authMiddleware, criteriaController.createCriteria);
router.put('/:id', authMiddleware, criteriaController.updateCriteria);
router.delete('/:id', authMiddleware, criteriaController.deleteCriteria);

export default router;
