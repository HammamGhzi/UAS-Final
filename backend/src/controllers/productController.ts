import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

// Ambil semua data produk beserta relasinya
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        sanggar: true,
        category: true,
        reviews: true,
      },
    });

    return success(res, products);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan produk');
  }
};

// Ambil satu produk berdasarkan id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { sanggar: true, category: true, reviews: true },
    });

    if (!product) {
      return error(res, 'Produk tidak ditemukan', 404);
    }

    return success(res, product);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan produk');
  }
};

// Buat produk baru
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sanggarId, categoryId, productName, price, stock, description, image } = req.body;

    const product = await prisma.product.create({
      data: {
        sanggarId,
        categoryId,
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

// Perbarui data produk yang sudah ada
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { sanggarId, categoryId, productName, price, stock, description, image } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        sanggarId,
        categoryId,
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

// Hapus produk berdasarkan id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    return success(res, null, 'Produk berhasil dihapus');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menghapus produk');
  }
};
