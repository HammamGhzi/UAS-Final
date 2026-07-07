import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearAllReviews, getStoredReviews, seedSampleReviews } from "./reviewStore";
import type { ProductRecord } from "@/pages/adminSanggar/productStore";

export const REVIEWS_QUERY_KEY = ["admin-sanggar-reviews"] as const;

// NOTE: sama seperti useProducts.ts, queryFn ini masih baca dari localStorage.
// Nanti kalau backend sudah bisa filter review berdasarkan sanggar (lewat adminId),
// tinggal ganti isi fungsi ini jadi panggilan axios ke GET /reviews.

export const useReviews = () =>
  useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: async () => getStoredReviews(),
  });

export const useSeedSampleReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (products: ProductRecord[]) => seedSampleReviews(products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
};

export const useClearReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => clearAllReviews(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
};