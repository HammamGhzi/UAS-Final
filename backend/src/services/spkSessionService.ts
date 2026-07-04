import prisma from '../config/prisma';

export async function createSpkSession(data: {
  sessionId: string;
  userId: number;
  regionId?: number | null;
  categoryId?: number | null;
  minPrice?: number;
  maxPrice?: number;
  userLat: number;
  userLon: number;
  weightHistoryId: number;
}) {
  return prisma.spkSession.create({ data });
}

export async function getSpkSession(sessionId: string) {
  return prisma.spkSession.findUnique({ where: { sessionId } });
}

export default { createSpkSession, getSpkSession };
