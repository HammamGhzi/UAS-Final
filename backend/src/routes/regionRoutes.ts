import express from 'express';
import * as regionController from '../controllers/regionController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Publik: dropdown wilayah di form admin sanggar butuh baca ini tanpa login
router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);

// Cuma SUPER_ADMIN yang boleh ubah master data wilayah
router.post('/', authMiddleware, authorizeRoles(['SUPER_ADMIN']), regionController.createRegion);
router.put('/:id', authMiddleware, authorizeRoles(['SUPER_ADMIN']), regionController.updateRegion);
router.delete('/:id', authMiddleware, authorizeRoles(['SUPER_ADMIN']), regionController.deleteRegion);

export default router;