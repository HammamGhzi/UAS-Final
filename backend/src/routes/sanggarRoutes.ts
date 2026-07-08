import express from 'express';
import * as sanggarController from '../controllers/sanggarController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', sanggarController.getAllSanggars);
router.get('/me', authMiddleware, sanggarController.getMySanggar); // WAJIB sebelum '/:id'
router.get('/:id', sanggarController.getSanggarById);
router.post('/', authMiddleware, authorizeRoles(['ADMIN']), sanggarController.createSanggar);
router.put('/:id', authMiddleware, authorizeRoles(['ADMIN', 'SUPER_ADMIN']), sanggarController.updateSanggar);
router.delete('/:id', authMiddleware, authorizeRoles(['SUPER_ADMIN']), sanggarController.deleteSanggar);

export default router;