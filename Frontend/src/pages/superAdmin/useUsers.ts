import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/api";
import type { Role } from "@/types/auth";

export type ManagedUser = {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export const USERS_QUERY_KEY = ["users"] as const;

export const useUsers = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const res = await userApi.getAll();
      return res.data.data as ManagedUser[];
    },
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) =>
      userApi.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};