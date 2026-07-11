import { Request, Response } from 'express';
import * as recommendationService from '../services/recommendationService';
import * as spkSessionService from '../services/spkSessionService';
import { success, error } from '../utils/response';

// Jalankan proses rekomendasi berdasarkan metode yang dipilih
export const createAndRunRecommendation = async (req: Request, res: Response) => {
  try {
    const { sessionId, userId, regionId, categoryId, minPrice, maxPrice, userLat, userLon, weightHistoryId, method } = req.body;

    await spkSessionService.createSpkSession({ sessionId, userId, regionId, categoryId, minPrice, maxPrice, userLat, userLon, weightHistoryId });

    const results = method === 'saw'
      ? await recommendationService.getSawResults(sessionId)
      : await recommendationService.getTopsisResults(sessionId);

    return success(res, { sessionId, results });
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to run recommendation');
  }
};

// Ambil hasil rekomendasi berdasarkan session id
export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const results = await recommendationService.getTopsisResults(sessionId);
    return success(res, results);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get recommendation');
  }
};

// Endpoint publik (tanpa login) khusus alur Katalog: setelah user filter
// wilayah + jenis batik di landing page dan produk awal tampil di halaman
// Katalog, user pilih kriteria SPK lewat 2 dropdown "Urutkan Berdasarkan",
// lalu endpoint ini yang menjalankan TOPSIS beneran (bukan filter).
// userId opsional karena tamu (belum login) juga boleh pakai fitur ini.
export const runPublicRecommendation = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      userId,
      regionId,
      categoryId,
      minPrice,
      maxPrice,
      userLat,
      userLon,
      weightHistoryId,
    } = req.body;

    if (!sessionId) {
      return error(res, 'sessionId wajib diisi', 400);
    }
    if (!weightHistoryId) {
      return error(res, 'weightHistoryId wajib diisi (buat dulu lewat /api/weight-histories)', 400);
    }
    if (userLat === undefined || userLon === undefined) {
      return error(res, 'userLat dan userLon wajib diisi', 400);
    }

    await spkSessionService.createSpkSession({
      sessionId,
      userId: userId ?? null,
      regionId: regionId ?? null,
      categoryId: categoryId ?? null,
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? 999999999,
      userLat,
      userLon,
      weightHistoryId,
    });

    const results = await recommendationService.getTopsisResultsWithSanggar(sessionId);

    return success(res, { sessionId, results });
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menjalankan rekomendasi');
  }
};

export default { createAndRunRecommendation, getRecommendation, runPublicRecommendation };