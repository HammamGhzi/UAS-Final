import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Semua route di bawah ini WAJIB login DAN role-nya SUPER_ADMIN
router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN']));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;