import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mySanggarApi, regionApi } from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SanggarFormValues } from "./sanggarDraft";

export type SanggarRecord = {
  id: number;
  regionId: number;
  adminId: number | null;
  name: string;
  ownerName: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string | null;
  description: string | null;
  image: string | null;
  region?: { id: number; name: string };
};

export type RegionRecord = { id: number; name: string };

export const REGIONS_QUERY_KEY = ["regions"] as const;

// queryKey sekarang ikut userId -> tiap akun punya slot cache sendiri
export const useMySanggar = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["my-sanggar", userId],
    queryFn: async () => {
      const res = await mySanggarApi.getMine();
      return res.data.data as SanggarRecord | null;
    },
    enabled: Boolean(userId),
  });
};

export const useRegions = () =>
  useQuery({
    queryKey: REGIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await regionApi.getAll();
      return res.data.data as RegionRecord[];
    },
  });

export const useCreateSanggar = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  return useMutation({
    mutationFn: (values: SanggarFormValues) => mySanggarApi.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-sanggar", userId] }),
  });
};

export const useUpdateSanggar = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: SanggarFormValues }) =>
      mySanggarApi.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-sanggar", userId] }),
  });
};