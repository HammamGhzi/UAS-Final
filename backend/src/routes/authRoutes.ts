import express from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authMiddleware, authController.me); // baru
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

export default router;