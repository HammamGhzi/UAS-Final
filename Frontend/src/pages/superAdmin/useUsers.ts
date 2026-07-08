import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserRecord,
  deleteUserRecord,
  getUsers,
  updateUserRecord,
  type UserFormValues,
} from "@/pages/superAdmin/UserStore";

export const USERS_QUERY_KEY = ["users"] as const;

export const useUsers = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: UserFormValues) => createUserRecord(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserFormValues }) =>
      updateUserRecord(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};