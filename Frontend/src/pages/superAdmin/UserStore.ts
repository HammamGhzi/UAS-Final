import { z } from "zod";
import { userApi } from "@/services/api";
import type { Role } from "@/types/auth";

export const ROLE_OPTIONS: Role[] = ["SUPER_ADMIN", "ADMIN", "USER"];

// Label yang lebih manusiawi buat ditampilkan di tabel/select
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin Sanggar",
  USER: "User",
};

// Satu schema dipakai untuk create & edit.
// Password dibuat optional di level Zod supaya tipe form konsisten;
// validasi "wajib diisi saat create" & "minimal 6 karakter kalau diisi"
// ditangani di komponen (userFormModal.tsx), bukan di sini.
export const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid.")
    .max(50, "Email maksimal 50 karakter."),
  password: z.string().default(""),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "USER"]),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const emptyUserForm: UserFormValues = {
  email: "",
  password: "",
  role: "USER",
};

// Bentuk data sesuai response Prisma (model User, tanpa field password)
export type UserRecord = {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

type ApiEnvelope<T> = {
  message?: string;
  data: T;
};

export const getUsers = async (): Promise<UserRecord[]> => {
  const res = await userApi.getAll();
  const body: ApiEnvelope<UserRecord[]> = res.data;
  return body.data ?? [];
};

export const createUserRecord = async (
  values: UserFormValues
): Promise<UserRecord> => {
  const res = await userApi.create({
    email: values.email.trim(),
    password: values.password ?? "",
    role: values.role,
  });
  const body: ApiEnvelope<UserRecord> = res.data;
  return body.data;
};

export const updateUserRecord = async (
  id: number,
  values: UserFormValues
): Promise<UserRecord> => {
  const payload: Record<string, unknown> = {
    email: values.email.trim(),
    role: values.role,
  };

  // Password cuma dikirim kalau memang diisi (mode edit)
  if (values.password) {
    payload.password = values.password;
  }

  const res = await userApi.update(id, payload);
  const body: ApiEnvelope<UserRecord> = res.data;
  return body.data;
};

export const deleteUserRecord = async (id: number): Promise<void> => {
  await userApi.delete(id);
};

export const userToFormValues = (user: UserRecord): UserFormValues => ({
  email: user.email,
  password: "",
  role: user.role,
});