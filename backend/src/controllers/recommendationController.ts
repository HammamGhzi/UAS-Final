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

export default { createAndRunRecommendation, getRecommendation };