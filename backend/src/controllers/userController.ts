import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

const SALT_ROUNDS = 10;
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'USER'];

// Ambil semua data pengguna (Super Admin, Admin Sanggar, User)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, users);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get users');
  }
};

// Ambil satu pengguna berdasarkan id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get user');
  }
};

// Buat pengguna baru — dipakai Super Admin untuk membuat akun
// SUPER_ADMIN, ADMIN (sanggar), maupun USER. Bedanya cuma di field `role`.
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return error(res, 'Email dan password wajib diisi', 400);
    }

    if (role && !VALID_ROLES.includes(role)) {
      return error(res, 'Role tidak valid', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'Email sudah terdaftar', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    return success(
      res,
      {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      'User berhasil dibuat',
      201
    );
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create user');
  }
};

// Perbarui data pengguna (email, password opsional, role)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email, password, role } = req.body;

    if (role && !VALID_ROLES.includes(role)) {
      return error(res, 'Role tidak valid', 400);
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (existingUser) {
        return error(res, 'Email sudah dipakai akun lain', 409);
      }
    }

    const data: any = {};
    if (email) data.email = email;
    if (role) data.role = role;
    if (password) {
      data.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await prisma.user.update({ where: { id }, data });
    return success(
      res,
      { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt },
      'User updated'
    );
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update user');
  }
};

// Hapus pengguna berdasarkan id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const requester = (req as any).user;

    // Cegah Super Admin menghapus akunnya sendiri lewat menu ini
    if (requester?.id === id) {
      return error(res, 'Tidak bisa menghapus akun sendiri', 400);
    }

    await prisma.user.delete({ where: { id } });
    return success(res, null, 'User deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete user');
  }
};