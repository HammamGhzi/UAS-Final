import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

// Ambil semua data sanggar beserta region dan produk
export const getAllSanggars = async (req: Request, res: Response) => {
  try {
    const sanggars = await prisma.sanggar.findMany({ include: { region: true, products: true } });
    return success(res, sanggars);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get sanggars');
  }
};

// Ambil satu sanggar berdasarkan id
export const getSanggarById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sanggar = await prisma.sanggar.findUnique({
      where: { id },
      include: { region: true, products: true },
    });

    if (!sanggar) {
      return error(res, 'Sanggar not found', 404);
    }

    return success(res, sanggar);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get sanggar');
  }
};

// Buat sanggar baru
export const createSanggar = async (req: Request, res: Response) => {
  try {
    const { regionId, adminId, name, ownerName, address, latitude, longitude, phone, description, image } = req.body;

    const sanggar = await prisma.sanggar.create({
      data: {
        regionId,
        adminId,
        name,
        ownerName,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        phone,
        description,
        image,
      },
    });

    return success(res, sanggar, 'Sanggar created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create sanggar');
  }
};

// Perbarui data sanggar yang sudah ada
export const updateSanggar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { regionId, adminId, name, ownerName, address, latitude, longitude, phone, description, image } = req.body;

    const sanggar = await prisma.sanggar.update({
      where: { id },
      data: {
        regionId,
        adminId,
        name,
        ownerName,
        address,
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        phone,
        description,
        image,
      },
    });

    return success(res, sanggar, 'Sanggar updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update sanggar');
  }
};

// Hapus sanggar berdasarkan id
export const deleteSanggar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.sanggar.delete({ where: { id } });
    return success(res, null, 'Sanggar deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete sanggar');
  }
};
