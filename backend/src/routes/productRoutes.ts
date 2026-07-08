import express from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', productController.getAllProducts); // support ?sanggarId=
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, authorizeRoles(['ADMIN']), productController.createProduct);
router.put('/:id', authMiddleware, authorizeRoles(['ADMIN', 'SUPER_ADMIN']), productController.updateProduct);
router.delete('/:id', authMiddleware, authorizeRoles(['ADMIN', 'SUPER_ADMIN']), productController.deleteProduct);

export default router;