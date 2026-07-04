import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export async function getAllReviews(req: Request, res: Response) {
  try {
    const reviews = await prisma.review.findMany({ include: { product: true, user: true } });
    return success(res, reviews);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get reviews');
  }
}

export async function getReviewById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const review = await prisma.review.findUnique({ where: { id }, include: { product: true, user: true } });
    if (!review) {
      return error(res, 'Review not found', 404);
    }
    return success(res, review);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get review');
  }
}

export async function createReview(req: Request, res: Response) {
  try {
    const { productId, userId, reviewerName, quality, popularity, design, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        reviewerName,
        quality: Number(quality),
        popularity: Number(popularity),
        design: Number(design),
        comment,
      },
    });
    return success(res, review, 'Review created', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to create review');
  }
}

export async function updateReview(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { productId, userId, reviewerName, quality, popularity, design, comment } = req.body;
    const review = await prisma.review.update({
      where: { id },
      data: {
        productId,
        userId,
        reviewerName,
        quality: quality !== undefined ? Number(quality) : undefined,
        popularity: popularity !== undefined ? Number(popularity) : undefined,
        design: design !== undefined ? Number(design) : undefined,
        comment,
      },
    });
    return success(res, review, 'Review updated');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to update review');
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.review.delete({ where: { id } });
    return success(res, null, 'Review deleted');
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to delete review');
  }
}
