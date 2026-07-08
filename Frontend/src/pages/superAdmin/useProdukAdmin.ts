import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/services/api";

// Bentuk data persis seperti yang dibalikin productController.ts
// (include: { sanggar: true, category: true, reviews: true })
export type ManagedProduct = {
  id: number;
  sanggarId: number;
  categoryId: number;
  productName: string;
  price: number;
  stock: number;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  sanggar: { id: number; name: string };
  category: { id: number; categoryName: string };
};

export const PRODUCTS_QUERY_KEY = ["products"] as const;

export const useProdukList = () =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const res = await productApi.getAll();
      return res.data.data as ManagedProduct[];
    },
  });

export const useUpdateProduk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

export const useDeleteProduk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};