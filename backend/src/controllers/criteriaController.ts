import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

// Ambil semua data kriteria
export const getAllCriteria = async (req: Request, res: Response) => {
  try {
    const criterias = await prisma.criteria.findMany();
    return success(res, criterias);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan criteria');
  }
};

// Ambil satu kriteria berdasarkan id
export const getCriteriaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const criteria = await prisma.criteria.findUnique({ where: { id } });

    if (!criteria) {
      return error(res, 'Kriteria tidak ditemukan', 404);
    }

    return success(res, criteria);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan kriteria');
  }
};

// Buat kriteria baru
export const createCriteria = async (req: Request, res: Response) => {
  try {
    const { criteriaName, attribute, description } = req.body;
    const criteria = await prisma.criteria.create({
      data: {
        criteriaName,
        attribute,
        description,
      },
    });

    return success(res, criteria, 'Kriteria dibuat', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal membuat kriteria');
  }
};

// Perbarui data kriteria yang sudah ada
export const updateCriteria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { criteriaName, attribute, description } = req.body;
    const criteria = await prisma.criteria.update({
      where: { id },
      data: {
        criteriaName,
        attribute,
        description,
      },
    });

    return success(res, criteria, 'Kriteria diperbarui');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal memperbarui kriteria');
  }
};

// Hapus kriteria berdasarkan id
export const deleteCriteria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.criteria.delete({ where: { id } });
    return success(res, null, 'Kriteria berhasil dihapus');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menghapus kriteria');
  }
};
