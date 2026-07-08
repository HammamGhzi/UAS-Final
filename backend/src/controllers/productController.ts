import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { sanggarId } = req.query;
    const products = await prisma.product.findMany({
      where: sanggarId ? { sanggarId: Number(sanggarId) } : undefined,
      include: { sanggar: true, category: true, reviews: true },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, products);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan produk');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { sanggar: true, category: true, reviews: true },
    });
    if (!product) return error(res, 'Produk tidak ditemukan', 404);
    return success(res, product);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan produk');
  }
};

// Sanggar milik admin yang login otomatis dipakai, categoryId & sanggarId TIDAK dipercaya dari body
export const createProduct = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const { categoryId, productName, price, stock, description, image } = req.body;

    const sanggar = await prisma.sanggar.findFirst({ where: { adminId } });
    if (!sanggar) {
      return error(res, 'Anda belum memiliki sanggar terdaftar', 409);
    }

    const product = await prisma.product.create({
      data: {
        sanggarId: sanggar.id,
        categoryId: Number(categoryId),
        productName,
        price: Number(price),
        stock: Number(stock) || 0,
        description,
        image,
      },
    });

    return success(res, product, 'Produk dibuat', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal membuat produk');
  }
};

// ADMIN cuma boleh edit produk milik sanggarnya sendiri; SUPER_ADMIN boleh edit semua
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const currentUser = (req as any).user;
    const { categoryId, productName, price, stock, description, image } = req.body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { sanggar: true },
    });
    if (!existing) return error(res, 'Produk tidak ditemukan', 404);

    if (currentUser.role !== 'SUPER_ADMIN' && existing.sanggar.adminId !== currentUser.id) {
      return error(res, 'Anda tidak punya akses ke produk ini', 403);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        productName,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        description,
        image,
      },
    });

    return success(res, product, 'Produk diperbarui');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal memperbarui produk');
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const currentUser = (req as any).user;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { sanggar: true },
    });
    if (!existing) return error(res, 'Produk tidak ditemukan', 404);

    if (currentUser.role !== 'SUPER_ADMIN' && existing.sanggar.adminId !== currentUser.id) {
      return error(res, 'Anda tidak punya akses ke produk ini', 403);
    }

    await prisma.product.delete({ where: { id } });
    return success(res, null, 'Produk berhasil dihapus');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menghapus produk');
  }
};