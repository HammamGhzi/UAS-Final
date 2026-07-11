import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export const getAllRegions = async (req: Request, res: Response) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: 'asc' },
      include: { sanggars: { select: { id: true } } }, // hanya ambil id, cukup untuk hitung jumlah
    });
    return success(res, regions);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan wilayah');
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const region = await prisma.region.findUnique({ where: { id } });
    if (!region) return error(res, 'Wilayah tidak ditemukan', 404);
    return success(res, region);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal mendapatkan wilayah');
  }
};

export const createRegion = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return error(res, 'Nama wilayah harus diisi', 400);
    }

    const existing = await prisma.region.findUnique({ where: { name: name.trim() } });
    if (existing) return error(res, 'Wilayah sudah ada', 409);

    const region = await prisma.region.create({ data: { name: name.trim() } });
    return success(res, region, 'Wilayah berhasil dibuat', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal membuat wilayah');
  }
};

export const updateRegion = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return error(res, 'Nama wilayah harus diisi', 400);
    }

    const region = await prisma.region.update({
      where: { id },
      data: { name: name.trim() },
    });

    return success(res, region, 'Wilayah berhasil diperbarui');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal memperbarui wilayah');
  }
};

export const deleteRegion = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Cegah hapus wilayah yang masih dipakai sanggar (regionId di schema onDelete: Restrict)
    const usedByCount = await prisma.sanggar.count({ where: { regionId: id } });
    if (usedByCount > 0) {
      return error(res, `Wilayah ini masih dipakai oleh ${usedByCount} sanggar, tidak bisa dihapus`, 409);
    }

    await prisma.region.delete({ where: { id } });
    return success(res, null, 'Wilayah berhasil dihapus');
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal menghapus wilayah');
  }
};