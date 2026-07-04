import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.batikCategory.findMany({ include: { products: true } });
    return success(res, categories);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get categories');
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const category = await prisma.batikCategory.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      return error(res, 'Category not found', 404);
    }
    return success(res, category);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get category');
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { categoryName } = req.body;
    const category = await prisma.batikCategory.create({ data: { categoryName } });
    return success(res, category, 'Category created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create category');
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { categoryName } = req.body;
    const category = await prisma.batikCategory.update({
      where: { id },
      data: { categoryName },
    });
    return success(res, category, 'Category updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update category');
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.batikCategory.delete({ where: { id } });
    return success(res, null, 'Category deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete category');
  }
}
