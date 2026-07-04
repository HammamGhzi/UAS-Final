import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { error } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return error(res, 'Authorization header missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (res.locals as any).user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
}
