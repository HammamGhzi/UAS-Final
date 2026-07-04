import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

const SALT_ROUNDS = 10;

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true, updatedAt: true } });
    return success(res, users);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get users');
  }
}

export async function getUserById(req: Request, res: Response) {
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
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { email, password, role } = req.body;
    const data: any = { email, role };

    if (password) {
      data.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await prisma.user.update({ where: { id }, data });
    return success(res, { id: user.id, email: user.email, role: user.role }, 'User updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update user');
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    return success(res, null, 'User deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete user');
  }
}
