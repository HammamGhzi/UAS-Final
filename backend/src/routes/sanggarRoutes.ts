import express from 'express';
import * as sanggarController from '../controllers/sanggarController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', sanggarController.getAllSanggars);
router.get('/:id', sanggarController.getSanggarById);
router.post('/', authMiddleware, sanggarController.createSanggar);
router.put('/:id', authMiddleware, sanggarController.updateSanggar);
router.delete('/:id', authMiddleware, sanggarController.deleteSanggar);

export default router;
