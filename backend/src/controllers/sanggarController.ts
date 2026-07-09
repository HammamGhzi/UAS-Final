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
      include: {
        region: true,
        products: {
          include: { category: true, reviews: true },
        },
      },
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

// Dipanggil Home page untuk section "Sanggar Batik Rekomendasi"
// Rating sanggar dihitung dari rata-rata review (quality, popularity, design)
// semua produk yang dimiliki sanggar tsb.
// Kalau SEMUA sanggar rating-nya masih 0 (belum ada review sama sekali),
// urutan ditampilkan acak (random) supaya tidak selalu sanggar yang sama di atas.
export const getRekomendasiSanggar = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const sanggars = await prisma.sanggar.findMany({
      include: {
        region: true,
        products: {
          include: {
            reviews: true,
          },
        },
      },
    });

    const withRating = sanggars.map((s) => {
      const allReviews = s.products.flatMap((p) => p.reviews);
      const jumlahReview = allReviews.length;

      let rating = 0;
      if (jumlahReview > 0) {
        const totalScore = allReviews.reduce(
          (sum, r) => sum + (r.quality + r.popularity + r.design) / 3,
          0
        );
        rating = totalScore / jumlahReview;
      }

      return {
        id: s.id,
        nama: s.name,
        foto: s.image,
        alamat: s.address,
        wilayah: s.region?.name ?? '',
        rating: Number(rating.toFixed(1)),
        jumlahReview,
        jumlahProduk: s.products.length,
      };
    });

    const allZero = withRating.every((s) => s.rating === 0);

    let result;
    if (allZero) {
      // Fisher-Yates shuffle biar urutannya acak tiap request
      const shuffled = [...withRating];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      result = shuffled.slice(0, limit);
    } else {
      result = [...withRating]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    }

    return success(res, result);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get rekomendasi sanggar');
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