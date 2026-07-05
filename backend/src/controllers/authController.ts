import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    return success(res, { id: user.id, email: user.email, role: user.role }, 'User registered', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Register failed', 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return error(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return success(res, { token, user: { id: user.id, email: user.email, role: user.role } }, 'Login successful');
  } catch (err) {
    return error(res, (err as Error).message || 'Login gagal', 500);
  }
}
