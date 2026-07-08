import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRegionRecord,
  deleteRegionRecord,
  getRegions,
  updateRegionRecord,
  type RegionFormValues,
} from "@/pages/superAdmin/RegionStore";

export const REGIONS_QUERY_KEY = ["regions"] as const;

export const useRegionsList = () =>
  useQuery({ queryKey: REGIONS_QUERY_KEY, queryFn: getRegions });

export const useCreateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RegionFormValues) => createRegionRecord(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEY }),
  });
};

export const useUpdateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: RegionFormValues }) =>
      updateRegionRecord(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEY }),
  });
};

export const useDeleteRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRegionRecord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEY }),
  });
};