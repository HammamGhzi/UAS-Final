export type ReviewRecord = {
  id: number;
  productId: number;
  reviewerName: string;
  quality: number;
  popularity: number;
  design: number;
  comment: string;
  createdAt: string;
};

export const getAverageRating = (review: ReviewRecord) =>
  (review.quality + review.popularity + review.design) / 3;

export const getProductAverageRating = (
  productId: number,
  reviews: ReviewRecord[]
) => {
  const productReviews = reviews.filter((review) => review.productId === productId);
  if (productReviews.length === 0) return 0;

  const total = productReviews.reduce((sum, review) => sum + getAverageRating(review), 0);
  return total / productReviews.length;
};