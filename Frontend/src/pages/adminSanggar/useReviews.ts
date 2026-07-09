import { useQuery } from "@tanstack/react-query";
import { myReviewApi } from "@/services/api";
import type { ReviewRecord } from "./reviewStore";

export const REVIEWS_QUERY_KEY = ["admin-sanggar-reviews"] as const;

type BackendReview = {
  id: number;
  productId: number;
  reviewerName: string;
  quality: number;
  popularity: number;
  design: number;
  comment: string | null;
  createdAt: string;
};

export const useReviews = () =>
  useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: async () => {
      const res = await myReviewApi.getMine();
      const data = res.data.data as BackendReview[];
      return data.map(
        (r): ReviewRecord => ({
          id: r.id,
          productId: r.productId,
          reviewerName: r.reviewerName,
          quality: r.quality,
          popularity: r.popularity,
          design: r.design,
          comment: r.comment ?? "",
          createdAt: r.createdAt,
        })
      );
    },
  });