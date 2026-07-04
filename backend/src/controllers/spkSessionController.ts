import { Request, Response } from 'express';
import * as spkSessionService from '../services/spkSessionService';
import { success, error } from '../utils/response';

export async function createSession(req: Request, res: Response) {
  try {
    const data = req.body;
    const session = await spkSessionService.createSpkSession(data);
    return success(res, session, 'Session created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create session');
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const sessionId = req.params.sessionId;
    const session = await spkSessionService.getSpkSession(sessionId);
    if (!session) return error(res, 'Session not found', 404);
    return success(res, session);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get session');
  }
}

export default { createSession, getSession };
