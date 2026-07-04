import { z } from "zod";

// Kategori sementara di frontend, nanti diganti fetch dari /categories
// begitu backend disambungkan.
export const productCategories = [
  { id: "1", name: "Flora" },
  { id: "2", name: "Fauna" },
  { id: "3", name: "Geometris" },
  { id: "4", name: "Kontemporer" },
  { id: "5", name: "Klasik" },
];

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

// Bentuk data produk yang sudah tersimpan, mengikuti model `Product`
// (sanggarId sengaja belum dipakai karena belum konek backend).
export type ProductRecord = {
  id: number;
  categoryId: number;
  productName: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "adminSanggarProducts";

export const emptyProductForm: ProductFormValues = {
  categoryId: "",
  productName: "",
  price: "",
  stock: "",
  description: "",
  image: "",
};

export const getCategoryName = (categoryId: number) =>
  productCategories.find((category) => Number(category.id) === categoryId)?.name ?? "-";

export const getStoredProducts = (): ProductRecord[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as ProductRecord[]) : [];
  } catch {
    return [];
  }
};

const persistProducts = (products: ProductRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const toRecordShape = (values: ProductFormValues) => ({
  categoryId: Number(values.categoryId),
  productName: values.productName.trim(),
  price: Number(values.price),
  stock: Number(values.stock),
  description: values.description.trim(),
  image: values.image,
});

export const createProductRecord = (values: ProductFormValues): ProductRecord => {
  const products = getStoredProducts();
  const now = new Date().toISOString();

  const newProduct: ProductRecord = {
    id: Date.now(),
    ...toRecordShape(values),
    createdAt: now,
    updatedAt: now,
  };

  persistProducts([newProduct, ...products]);
  return newProduct;
};

export const updateProductRecord = (
  id: number,
  values: ProductFormValues
): ProductRecord | null => {
  const products = getStoredProducts();
  let updated: ProductRecord | null = null;

  const next = products.map((product) => {
    if (product.id !== id) return product;

    updated = {
      ...product,
      ...toRecordShape(values),
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  persistProducts(next);
  return updated;
};

export const deleteProductRecord = (id: number) => {
  const products = getStoredProducts();
  persistProducts(products.filter((product) => product.id !== id));
};

export const productToFormValues = (product: ProductRecord): ProductFormValues => ({
  categoryId: String(product.categoryId),
  productName: product.productName,
  price: String(product.price),
  stock: String(product.stock),
  description: product.description,
  image: product.image,
});