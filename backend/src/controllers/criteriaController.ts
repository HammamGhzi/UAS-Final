import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export async function getAllCriteria(req: Request, res: Response) {
  try {
    const criterias = await prisma.criteria.findMany();
    return success(res, criterias);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get criteria');
  }
}

export async function getCriteriaById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const criteria = await prisma.criteria.findUnique({ where: { id } });
    if (!criteria) {
      return error(res, 'Criteria not found', 404);
    }
    return success(res, criteria);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get criteria');
  }
}

export async function createCriteria(req: Request, res: Response) {
  try {
    const { criteriaName, attribute, description } = req.body;
    const criteria = await prisma.criteria.create({
      data: {
        criteriaName,
        attribute,
        description,
      },
    });
    return success(res, criteria, 'Criteria created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create criteria');
  }
}

export async function updateCriteria(req: Request, res: Response) {
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
    return success(res, criteria, 'Criteria updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update criteria');
  }
}

export async function deleteCriteria(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.criteria.delete({ where: { id } });
    return success(res, null, 'Criteria deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete criteria');
  }
}
