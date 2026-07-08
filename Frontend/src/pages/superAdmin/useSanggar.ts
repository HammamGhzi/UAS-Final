import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sanggarApi } from "@/services/api";

// Bentuk data persis seperti yang dibalikin sanggarController.ts
// (include: { region: true, products: true })
export type ManagedSanggar = {
  id: number;
  regionId: number;
  name: string;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  region: { id: number; name: string };
  products: { id: number }[];
};

export const SANGGARS_QUERY_KEY = ["sanggars"] as const;

export const useSanggars = () =>
  useQuery({
    queryKey: SANGGARS_QUERY_KEY,
    queryFn: async () => {
      const res = await sanggarApi.getAll();
      return res.data.data as ManagedSanggar[];
    },
  });

export const useUpdateSanggar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      sanggarApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANGGARS_QUERY_KEY });
    },
  });
};

export const useDeleteSanggar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sanggarApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANGGARS_QUERY_KEY });
    },
  });
};