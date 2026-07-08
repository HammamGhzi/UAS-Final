import { z } from "zod";

const numericPattern = /^\d+$/;

export const produkEditSchema = z.object({
  productName: z
    .string()
    .min(1, "Nama produk wajib diisi.")
    .max(150, "Nama produk maksimal 150 karakter."),
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
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

export type ProdukEditFormValues = z.infer<typeof produkEditSchema>;

export const emptyProdukEditForm: ProdukEditFormValues = {
  productName: "",
  categoryId: "",
  price: "",
  stock: "",
  description: "",
  image: "",
};