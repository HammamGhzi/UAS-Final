import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductRecord,
  deleteProductRecord,
  getStoredProducts,
  updateProductRecord,
  type ProductFormValues,
} from "@/pages/adminSanggar/productStore";

// Query key terpusat biar gampang di-invalidate.
export const PRODUCTS_QUERY_KEY = ["admin-sanggar-products"] as const;

// NOTE: queryFn & mutationFn sekarang manggil productStore.ts (localStorage).
// Nanti kalau backend sudah disambungkan, cukup ganti isi productStore.ts
// jadi panggilan axios ke /products — hook & komponen di bawah gak perlu diubah.

export const useProducts = () =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => getStoredProducts(),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProductFormValues) => createProductRecord(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: ProductFormValues }) =>
      updateProductRecord(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => deleteProductRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};