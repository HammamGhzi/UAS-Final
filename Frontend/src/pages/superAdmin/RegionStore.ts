import { z } from "zod";
import { regionApi } from "@/services/api";

export const regionSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wilayah wajib diisi.")
    .max(100, "Nama wilayah maksimal 100 karakter."),
});

export type RegionFormValues = z.infer<typeof regionSchema>;

export const emptyRegionForm: RegionFormValues = { name: "" };

export type RegionRecord = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  sanggars?: { id: number }[];
};

type ApiEnvelope<T> = { message?: string; data: T };

export const getRegions = async (): Promise<RegionRecord[]> => {
  const res = await regionApi.getAll();
  const body: ApiEnvelope<RegionRecord[]> = res.data;
  return body.data ?? [];
};

export const createRegionRecord = async (values: RegionFormValues): Promise<RegionRecord> => {
  const res = await regionApi.create({ name: values.name.trim() });
  const body: ApiEnvelope<RegionRecord> = res.data;
  return body.data;
};

export const updateRegionRecord = async (id: number, values: RegionFormValues): Promise<RegionRecord> => {
  const res = await regionApi.update(id, { name: values.name.trim() });
  const body: ApiEnvelope<RegionRecord> = res.data;
  return body.data;
};

export const deleteRegionRecord = async (id: number): Promise<void> => {
  await regionApi.delete(id);
};

export const regionToFormValues = (region: RegionRecord): RegionFormValues => ({
  name: region.name,
});