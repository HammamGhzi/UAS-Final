import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

// Ambil semua data kategori batik dari database
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    // Cari semua kategori, urutkan berdasarkan id naik, dan sertakan data produk yang terkait
    const categories = await prisma.batikCategory.findMany({
      include: { products: true },
      orderBy: { id: 'asc' },
    });
    return success(res, categories);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan kategori batik');
  }
};

// Ambil satu kategori berdasarkan id
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    // Ubah param id dari string menjadi angka
    const id = Number(req.params.id);

    // Cari kategori berdasarkan id
    const category = await prisma.batikCategory.findUnique({
      where: { id },
      include: { products: true },
    });

    // Jika kategori tidak ditemukan, kirim respons error 404
    if (!category) {
      return error(res, 'Kategori tidak ditemukan', 404);
    }

    return success(res, category);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan kategori');
  }
};

// Buat kategori batik baru
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Ambil nama kategori dari body request
    const { categoryName } = req.body;

    // Validasi agar nama kategori wajib diisi dan berupa string
    if (!categoryName || typeof categoryName !== 'string') {
      return error(res, 'Nama kategori harus diisi', 400);
    }

    // Simpan data kategori ke database
    const category = await prisma.batikCategory.create({
      data: { categoryName: categoryName.trim() },
    });

    return success(res, category, 'Kategori berhasil dibuat', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal membuat kategori');
  }
};

// Update data kategori yang sudah ada
export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Ambil id dari parameter URL dan nama baru dari body
    const id = Number(req.params.id);
    const { categoryName } = req.body;

    // Validasi input sebelum update
    if (!categoryName || typeof categoryName !== 'string') {
      return error(res, 'Nama kategori harus diisi', 400);
    }

    // Update data kategori berdasarkan id
    const category = await prisma.batikCategory.update({
      where: { id },
      data: { categoryName: categoryName.trim() },
    });

    return success(res, category, 'Kategori berhasil diperbarui');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal memperbarui kategori');
  }
};

// Hapus kategori berdasarkan id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Hapus data kategori dari database
    await prisma.batikCategory.delete({ where: { id } });
    return success(res, null, 'Kategori berhasil dihapus');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menghapus kategori');
  }
};
