import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { error } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware untuk memverifikasi token JWT dan memastikan user memiliki role yang sesuai
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: number; userId?: number; email?: string; role?: string };
    const userId = decoded.id ?? decoded.userId;

    if (!userId) {
      return error(res, 'Token tidak valid', 401);
    }

    // Ambil data user dari database berdasarkan id dari token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return error(res, 'User tidak ditemukan', 404);
    }

    // Simpan informasi user lengkap ke request agar bisa dipakai nanti
    (req as any).user = user;
    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Token tidak valid', 401);
    }

    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token sudah kedaluwarsa', 401);
    }

    return error(res, 'Unauthorized. Terjadi kesalahan pada server', 500);
  }
};

// Middleware untuk membatasi akses berdasarkan role
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return error(res, 'Akses ditolak. Role Anda tidak memiliki izin', 403);
    }

    next();
  };
};

// Alias agar kompatibel dengan import authMiddleware di route lain
export const authMiddleware = authenticate;

export default {
  authenticate,
  authMiddleware,
  authorizeRoles,
};
