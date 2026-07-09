import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalUsers,
      totalProducts,
      totalSanggars,
      totalReviews,
      newUsers,
      newProducts,
      newSanggars,
      products,
      recentReviewsRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.sanggar.count(),
      prisma.review.count(),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.product.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.sanggar.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.product.findMany({
        include: { sanggar: true, reviews: true },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { product: { include: { sanggar: true } } },
      }),
    ]);

    const allRatings: number[] = [];
    const topRatedProducts = products
      .map((p) => {
        const ratings = p.reviews.map((r) => (r.quality + r.popularity + r.design) / 3);
        ratings.forEach((r) => allRatings.push(r));
        const avgRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
        return {
          id: p.id,
          name: p.productName,
          image: p.image,
          sanggarName: p.sanggar.name,
          avgRating,
        };
      })
      .filter((p) => p.avgRating > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    const avgRating = allRatings.length
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

    const recentReviews = recentReviewsRaw.map((r) => ({
      id: r.id,
      reviewerName: r.reviewerName,
      productName: r.product.productName,
      sanggarName: r.product.sanggar.name,
      comment: r.comment,
      rating: (r.quality + r.popularity + r.design) / 3,
    }));

    return success(res, {
      totals: {
        users: totalUsers,
        products: totalProducts,
        sanggars: totalSanggars,
        reviews: totalReviews,
      },
      newThisWeek: {
        users: newUsers,
        products: newProducts,
        sanggars: newSanggars,
      },
      avgRating,
      topRatedProducts,
      recentReviews,
    });
  } catch (err) {
    return error(res, (err as Error).message || 'Failed to get dashboard summary');
  }
};