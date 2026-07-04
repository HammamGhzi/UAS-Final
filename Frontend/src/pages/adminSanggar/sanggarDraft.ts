import { z } from "zod";

export type SanggarDraft = {
  regionId: string;
  name: string;
  ownerName: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  description: string;
  image: string;
};

const decimalPattern = /^-?\d+(\.\d+)?$/;

export const sanggarSchema = z.object({
  regionId: z.string().min(1, "Wilayah wajib dipilih."),
  name: z.string().min(1, "Nama sanggar wajib diisi."),
  ownerName: z.string().min(1, "Nama pemilik wajib diisi."),
  phone: z
    .string()
    .min(1, "Nomor HP wajib diisi.")
    .regex(/^[0-9+ -]+$/, "Nomor HP hanya boleh angka."),
  latitude: z
    .string()
    .min(1, "Latitude wajib diisi.")
    .regex(decimalPattern, "Latitude harus berupa angka, contoh -6.8694."),
  longitude: z
    .string()
    .min(1, "Longitude wajib diisi.")
    .regex(decimalPattern, "Longitude harus berupa angka, contoh 109.1402."),
  address: z.string().min(1, "Alamat lengkap wajib diisi."),
  description: z.string(),
  image: z.string(),
});

export type SanggarFormValues = z.infer<typeof sanggarSchema>;

export const emptySanggarDraft: SanggarDraft = {
  regionId: "",
  name: "",
  ownerName: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  description: "",
  image: "",
};

export const requiredSanggarFields: Array<keyof SanggarDraft> = [
  "regionId",
  "name",
  "ownerName",
  "address",
  "latitude",
  "longitude",
];

export const fieldLabels: Record<keyof SanggarDraft, string> = {
  regionId: "Wilayah",
  name: "Nama sanggar",
  ownerName: "Nama pemilik",
  address: "Alamat lengkap",
  latitude: "Latitude",
  longitude: "Longitude",
  phone: "Nomor HP",
  description: "Deskripsi",
  image: "URL gambar",
};

export const getStoredSanggarDraft = () => {
  const saved = localStorage.getItem("adminSanggarDraft");
  if (!saved) return emptySanggarDraft;

  try {
    return { ...emptySanggarDraft, ...JSON.parse(saved) } as SanggarDraft;
  } catch {
    return emptySanggarDraft;
  }
};

export const saveSanggarDraft = (draft: SanggarDraft) => {
  localStorage.setItem("adminSanggarDraft", JSON.stringify(draft));
};

export const isSanggarSubmitted = () =>
  localStorage.getItem("adminSanggarSubmitted") === "true";

export const setSanggarSubmitted = (submitted: boolean) => {
  localStorage.setItem("adminSanggarSubmitted", String(submitted));
};

export const isSanggarBannerDismissed = () =>
  localStorage.getItem("adminSanggarBannerDismissed") === "true";

export const setSanggarBannerDismissed = (dismissed: boolean) => {
  localStorage.setItem("adminSanggarBannerDismissed", String(dismissed));
};

export const getMissingSanggarFields = (draft: SanggarDraft) =>
  requiredSanggarFields.filter((field) => !draft[field].trim());

export const isSanggarComplete = (draft: SanggarDraft) =>
  getMissingSanggarFields(draft).length === 0;