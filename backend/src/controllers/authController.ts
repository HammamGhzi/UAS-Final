import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';
import { sendOtpEmail } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Daftarkan pengguna baru ke sistem
export const register = async (req: Request, res: Response) => {
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
};

// Login pengguna dan buat token JWT
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, 'Email Tidak Terdaftar', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return error(res, 'Password salah', 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return success(res, { token, user: { id: user.id, email: user.email, role: user.role } }, 'Login sukses ');
  } catch (err) {
    return error(res, (err as Error).message || 'Login gagal', 500);
  }
};

// Ambil profil user yang sedang login berdasarkan token
export const me = async (req: Request, res: Response) => {
  const user = (req as any).user; // ini di-set oleh authMiddleware
  return success(res, user, 'Profil user');
};

// Step 1: User submit email, sistem generate OTP dan kirim ke email
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return error(res, 'Email wajib diisi', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, 'Email tidak terdaftar', 404);
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExpiry: expiry },
    });

    await sendOtpEmail(email, otp);

    return success(res, null, 'Kode OTP telah dikirim ke email kamu');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mengirim OTP', 500);
  }
};

// Step 2: User submit email + OTP, sistem cek valid & belum expired
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return error(res, 'Email dan kode OTP wajib diisi', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return error(res, 'OTP tidak valid, silakan minta ulang', 400);
    }

    if (user.resetOtp !== otp) {
      return error(res, 'Kode OTP salah', 400);
    }

    if (new Date() > user.resetOtpExpiry) {
      return error(res, 'Kode OTP sudah kedaluwarsa, silakan minta ulang', 400);
    }

    return success(res, null, 'OTP valid');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal verifikasi OTP', 500);
  }
};

// Step 3: User submit email + OTP + password baru, sistem update password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return error(res, 'Email, OTP, dan password baru wajib diisi', 400);
    }

    if (newPassword.length < 6) {
      return error(res, 'Password baru minimal 6 karakter', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return error(res, 'OTP tidak valid, silakan minta ulang', 400);
    }

    if (user.resetOtp !== otp) {
      return error(res, 'Kode OTP salah', 400);
    }

    if (new Date() > user.resetOtpExpiry) {
      return error(res, 'Kode OTP sudah kedaluwarsa, silakan minta ulang', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiry: null,
      },
    });

    return success(res, null, 'Password berhasil diubah, silakan login');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal reset password', 500);
  }
};