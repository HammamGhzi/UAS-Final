import { z } from "zod";
import { batikCategoryApi } from "@/services/api";

// Schema validasi — samain sama constraint backend:
// categoryName wajib string, di DB @db.VarChar(100)
export const categorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Nama kategori wajib diisi.")
    .max(100, "Nama kategori maksimal 100 karakter."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const emptyCategoryForm: CategoryFormValues = {
  categoryName: "",
};

// Bentuk data sesuai response Prisma (model BatikCategory + relasi products)
export type CategoryRecord = {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  products?: { id: number }[];
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const getCategories = async (): Promise<CategoryRecord[]> => {
  const res = await batikCategoryApi.getAll();
  const body: ApiEnvelope<CategoryRecord[]> = res.data;
  return body.data ?? [];
};

export const createCategoryRecord = async (
  values: CategoryFormValues
): Promise<CategoryRecord> => {
  const res = await batikCategoryApi.create({
    categoryName: values.categoryName.trim(),
  });
  const body: ApiEnvelope<CategoryRecord> = res.data;
  return body.data;
};

export const updateCategoryRecord = async (
  id: number,
  values: CategoryFormValues
): Promise<CategoryRecord> => {
  const res = await batikCategoryApi.update(id, {
    categoryName: values.categoryName.trim(),
  });
  const body: ApiEnvelope<CategoryRecord> = res.data;
  return body.data;
};

export const deleteCategoryRecord = async (id: number): Promise<void> => {
  await batikCategoryApi.delete(id);
};

export const categoryToFormValues = (category: CategoryRecord): CategoryFormValues => ({
  categoryName: category.categoryName,
});