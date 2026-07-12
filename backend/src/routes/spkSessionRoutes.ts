import express from 'express';
import * as spkSessionController from '../controllers/spkSessionController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Buat sesi SPK baru (publik — dipakai user/tamu saat jalankan TOPSIS di katalog)
router.post('/', spkSessionController.createSession);

// Ambil satu sesi berdasarkan sessionId (dipakai internal setelah TOPSIS)
router.get('/:sessionId/detail', authMiddleware, authorizeRoles(['SUPER_ADMIN']), spkSessionController.getSessionDetail);

// [Super Admin] Daftar semua sesi SPK
router.get('/', authMiddleware, authorizeRoles(['SUPER_ADMIN']), spkSessionController.listSessions);

// Ambil sesi mentah (sudah ada sebelumnya, dipakai internal)
router.get('/:sessionId', authMiddleware, spkSessionController.getSession);

export default router;
