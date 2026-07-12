import { Request, Response } from 'express';
import * as spkSessionService from '../services/spkSessionService';
import { success, error } from '../utils/response';

// Buat sesi SPK baru
export const createSession = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const session = await spkSessionService.createSpkSession(data);
    return success(res, session, 'Session created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create session');
  }
};

// Ambil data sesi berdasarkan session id
export const getSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await spkSessionService.getSpkSession(sessionId);

    if (!session) {
      return error(res, 'Session not found', 404);
    }

    return success(res, session);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get session');
  }
};

// [Super Admin] Ambil semua sesi SPK (daftar + info bobot & filter)
export const listSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await spkSessionService.getAllSpkSessions();
    return success(res, sessions);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to list sessions');
  }
};

// [Super Admin] Ambil detail satu sesi — full step TOPSIS dari base sampai hasil
export const getSessionDetail = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const detail = await spkSessionService.getSpkSessionDetail(sessionId);

    if (!detail) {
      return error(res, 'Session not found', 404);
    }

    return success(res, detail);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get session detail');
  }
};

export default { createSession, getSession, listSessions, getSessionDetail };
