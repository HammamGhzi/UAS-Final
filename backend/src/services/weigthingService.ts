import prisma from '../config/prisma';

export async function getWeightById(id: number) {
  return prisma.weightHistory.findUnique({ where: { id } });
}

export async function listWeights() {
  return prisma.weightHistory.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createWeight(data: { priceWeight: number; distanceWeight: number; qualityWeight: number; popularityWeight: number; designWeight: number }) {
  return prisma.weightHistory.create({ data });
}

export default { getWeightById, listWeights, createWeight };
