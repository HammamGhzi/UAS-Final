import prisma from '../config/prisma';

// Buat sesi SPK baru
export const createSpkSession = async (data: {
  sessionId: string;
  userId?: number | null;
  regionId?: number | null;
  categoryId?: number | null;
  minPrice?: number;
  maxPrice?: number;
  userLat: number;
  userLon: number;
  weightHistoryId: number;
}) => {
  return prisma.spkSession.create({ data });
};

// Ambil sesi SPK berdasarkan session id
export const getSpkSession = async (sessionId: string) => {
  return prisma.spkSession.findUnique({ where: { sessionId } });
};

export default { createSpkSession, getSpkSession };