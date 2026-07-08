import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

// Bentuk data persis seperti yang dibalikin reviewController.ts
// (include: { product: true, user: true })
export type ManagedReview = {
  id: number;
  productId: number;
  userId: number | null;
  reviewerName: string;
  quality: number;
  popularity: number;
  design: number;
  comment: string | null;
  createdAt: string;
  product: { id: number; productName: string };
  user: { id: number; email: string } | null;
};

export const REVIEWS_QUERY_KEY = ["reviews"] as const;

// Rating gabungan ditampilkan sebagai rata-rata quality/popularity/design
export const getReviewRating = (review: ManagedReview) =>
  Math.round((review.quality + review.popularity + review.design) / 3);

export const useReviewsAdmin = () =>
  useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/reviews");
      return res.data.data as ManagedReview[];
    },
  });

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
};