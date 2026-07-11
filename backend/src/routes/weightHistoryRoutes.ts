import express from 'express';
import * as weightHistoryController from '../controllers/weightHistoryController';

const router = express.Router();

// Publik: dipanggil dari halaman Katalog sebelum menjalankan TOPSIS,
// user (login maupun tamu) boleh membuat kombinasi bobotnya sendiri.
router.post('/', weightHistoryController.createWeightHistory);

export default router;