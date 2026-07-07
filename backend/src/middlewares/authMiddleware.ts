import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { error } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware untuk memverifikasi token JWT yang dikirim client
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header authorization ada
  if (!authHeader) {
    return error(res, 'Unauthorized. Token tidak ditemukan', 401);
  }

  // Ambil token dari format "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Jika token tidak ditemukan
  if (!token) {
    return error(res, 'Format token tidak valid', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return error(res, 'Unauthorized. Token tidak valid', 401);
  }
};
