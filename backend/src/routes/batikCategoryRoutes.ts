import express from 'express';
import * as batikCategoryController from '../controllers/batikCategoryController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', batikCategoryController.getAllCategories);
router.get('/:id', batikCategoryController.getCategoryById);
router.post('/', authMiddleware, batikCategoryController.createCategory);
router.put('/:id', authMiddleware, batikCategoryController.updateCategory);
router.delete('/:id', authMiddleware, batikCategoryController.deleteCategory);

export default router;
