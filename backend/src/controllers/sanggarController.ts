import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export const getAllSanggars = async (req: Request, res: Response) => {
  try {
    const sanggars = await prisma.sanggar.findMany({ include: { region: true, products: true } });
    return success(res, sanggars);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get sanggars');
  }
};

export const getSanggarById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sanggar = await prisma.sanggar.findUnique({
      where: { id },
      include: { region: true, products: true },
    });
    if (!sanggar) return error(res, 'Sanggar not found', 404);
    return success(res, sanggar);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get sanggar');
  }
};

// Dipanggil dashboard admin sanggar setiap login/refresh untuk cek "sudah punya toko atau belum"
export const getMySanggar = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id; // dari token JWT, bukan localStorage
    const sanggar = await prisma.sanggar.findFirst({
      where: { adminId },
      include: { region: true, products: true },
    });
    return success(res, sanggar); // null wajar kalau admin belum pernah isi form
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get sanggar');
  }
};

// adminId WAJIB dari token, bukan dari body — supaya gak bisa dipalsuin dari frontend
export const createSanggar = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const { regionId, name, ownerName, address, latitude, longitude, phone, description, image } = req.body;

    const existing = await prisma.sanggar.findFirst({ where: { adminId } });
    if (existing) return error(res, 'Anda sudah memiliki sanggar terdaftar', 409);

    const sanggar = await prisma.sanggar.create({
      data: {
        regionId: Number(regionId),
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

export const updateSanggar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const currentUser = (req as any).user;
    const { regionId, name, ownerName, address, latitude, longitude, phone, description, image } = req.body;

    const existing = await prisma.sanggar.findUnique({ where: { id } });
    if (!existing) return error(res, 'Sanggar not found', 404);

    // ADMIN cuma boleh edit sanggar miliknya; SUPER_ADMIN boleh edit semua
    if (currentUser.role !== 'SUPER_ADMIN' && existing.adminId !== currentUser.id) {
      return error(res, 'Anda tidak punya akses ke sanggar ini', 403);
    }

    const sanggar = await prisma.sanggar.update({
      where: { id },
      data: {
        regionId: regionId !== undefined ? Number(regionId) : undefined,
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

export const deleteSanggar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.sanggar.delete({ where: { id } });
    return success(res, null, 'Sanggar deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete sanggar');
  }
};