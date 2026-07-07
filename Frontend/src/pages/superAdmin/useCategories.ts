import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  getCategories,
  updateCategoryRecord,
  type CategoryFormValues,
} from "@/pages/superAdmin/CategoryStore";

// Query key terpusat biar gampang di-invalidate.
export const CATEGORIES_QUERY_KEY = ["batik-categories"] as const;

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CategoryFormValues) => createCategoryRecord(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: CategoryFormValues }) =>
      updateCategoryRecord(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoryRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};