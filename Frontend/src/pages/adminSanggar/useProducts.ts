import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductRecord,
  deleteProductRecord,
  getCategories,
  getProducts,
  updateProductRecord,
  type ProductFormValues,
} from "@/pages/adminSanggar/productStore";
import { useMySanggar } from "./useMySanggar";

export const PRODUCTS_QUERY_KEY = "admin-sanggar-products" as const;
export const CATEGORIES_QUERY_KEY = ["batik-categories"] as const;

// Produk otomatis di-scope ke sanggar milik admin yang login
export const useProducts = () => {
  const { data: sanggar } = useMySanggar();

  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, sanggar?.id],
    queryFn: () => getProducts(sanggar!.id),
    enabled: Boolean(sanggar?.id),
  });
};

export const useProductCategories = () =>
  useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { data: sanggar } = useMySanggar();

  return useMutation({
    mutationFn: (values: ProductFormValues) => createProductRecord(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY, sanggar?.id] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { data: sanggar } = useMySanggar();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ProductFormValues }) =>
      updateProductRecord(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY, sanggar?.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { data: sanggar } = useMySanggar();

  return useMutation({
    mutationFn: (id: number) => deleteProductRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY, sanggar?.id] });
    },
  });
};