import { z } from "zod";

const numericPattern = /^-?\d+(\.\d+)?$/;

export const sanggarEditSchema = z.object({
  name: z
    .string()
    .min(1, "Nama sanggar wajib diisi.")
    .max(150, "Nama sanggar maksimal 150 karakter."),
  regionId: z.string().min(1, "Wilayah wajib dipilih."),
  ownerName: z
    .string()
    .min(1, "Nama pemilik wajib diisi.")
    .max(100, "Nama pemilik maksimal 100 karakter."),
  address: z.string().min(1, "Alamat wajib diisi."),
  latitude: z
    .string()
    .min(1, "Latitude wajib diisi.")
    .regex(numericPattern, "Latitude harus berupa angka."),
  longitude: z
    .string()
    .min(1, "Longitude wajib diisi.")
    .regex(numericPattern, "Longitude harus berupa angka."),
  phone: z.string(),
  description: z.string(),
  image: z.string(),
});

export type SanggarEditFormValues = z.infer<typeof sanggarEditSchema>;

export const emptySanggarEditForm: SanggarEditFormValues = {
  name: "",
  regionId: "",
  ownerName: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  description: "",
  image: "",
};