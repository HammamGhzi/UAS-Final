import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      include: {
        sanggar: true,
        category: true,
        reviews: true,
      },
    });
    return success(res, products);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get products');
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { sanggar: true, category: true, reviews: true },
    });

    if (!product) {
      return error(res, 'Product not found', 404);
    }

    return success(res, product);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get product');
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { sanggarId, categoryId, productName, price, stock, description, image } = req.body;

    const product = await prisma.product.create({
      data: {
        sanggarId,
        categoryId,
        productName,
        price: Number(price),
        stock: Number(stock) || 0,
        description,
        image,
      },
    });

    return success(res, product, 'Product created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create product');
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { sanggarId, categoryId, productName, price, stock, description, image } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        sanggarId,
        categoryId,
        productName,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        description,
        image,
      },
    });

    return success(res, product, 'Product updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update product');
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    return success(res, null, 'Product deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete product');
  }
}
