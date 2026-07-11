import { z } from "zod";
import { productApi, batikCategoryApi } from "@/services/api";

const numericPattern = /^\d+$/;

export const productSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
  productName: z
    .string()
    .min(1, "Nama produk wajib diisi.")
    .max(150, "Nama produk maksimal 150 karakter."),
  price: z
    .string()
    .min(1, "Harga wajib diisi.")
    .regex(numericPattern, "Harga harus berupa angka bulat."),
  stock: z
    .string()
    .min(1, "Stok wajib diisi.")
    .regex(numericPattern, "Stok harus berupa angka bulat."),
  description: z.string(),
  image: z.string(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type CategoryRecord = { id: number; categoryName: string };

// Bentuk data mengikuti model `Product` di backend
export type ProductRecord = {
  id: number;
  sanggarId: number;
  categoryId: number;
  productName: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; categoryName: string };
};

export const emptyProductForm: ProductFormValues = {
  categoryId: "",
  productName: "",
  price: "",
  stock: "",
  description: "",
  image: "",
};

type ApiEnvelope<T> = { message?: string; data: T };

export const getCategories = async (): Promise<CategoryRecord[]> => {
  const res = await batikCategoryApi.getAll();
  const body: ApiEnvelope<CategoryRecord[]> = res.data;
  return body.data ?? [];
};

export const getCategoryNameFromList = (categoryId: number, categories: CategoryRecord[]) =>
  categories.find((category) => category.id === categoryId)?.categoryName ?? "-";

const toPayload = (values: ProductFormValues) => ({
  categoryId: Number(values.categoryId),
  productName: values.productName.trim(),
  price: Number(values.price),
  stock: Number(values.stock),
  description: values.description.trim(),
  image: values.image,
});

export const getProducts = async (sanggarId: number): Promise<ProductRecord[]> => {
  const res = await productApi.getAll({ sanggarId });
  const body: ApiEnvelope<ProductRecord[]> = res.data;
  // Backend field price adalah Decimal (kembali sebagai string dari Prisma+JSON), pastikan jadi number
  return (body.data ?? []).map((p) => ({ ...p, price: Number(p.price) }));
};

export const createProductRecord = async (values: ProductFormValues): Promise<ProductRecord> => {
  const res = await productApi.create(toPayload(values));
  const body: ApiEnvelope<ProductRecord> = res.data;
  return body.data;
};

export const updateProductRecord = async (
  id: number,
  values: ProductFormValues
): Promise<ProductRecord> => {
  const res = await productApi.update(id, toPayload(values));
  const body: ApiEnvelope<ProductRecord> = res.data;
  return body.data;
};

export const deleteProductRecord = async (id: number): Promise<void> => {
  await productApi.delete(id);
};

export const productToFormValues = (product: ProductRecord): ProductFormValues => ({
  categoryId: String(product.categoryId),
  productName: product.productName,
  price: String(product.price),
  stock: String(product.stock),
  description: product.description,
  image: product.image,
});