import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, UserCog, X } from "lucide-react";
import {
  userSchema,
  emptyUserForm,
  ROLE_LABELS,
  ROLE_OPTIONS,
  type UserFormValues,
} from "@/pages/superAdmin/UserStore";

type UserFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: UserFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
};

const UserFormModal = ({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: UserFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: emptyUserForm,
    mode: "onChange",
  });

  // Reset form setiap modal dibuka, baik mode create (kosong) atau edit (terisi)
  useEffect(() => {
    if (open) {
      reset(initialValues ?? emptyUserForm);
    }
  }, [open, initialValues, reset]);

  if (!open) return null;

  // Validasi password tambahan yang beda antara create & edit:
  // - create: wajib diisi, minimal 6 karakter
  // - edit: boleh kosong (artinya tidak diganti), tapi kalau diisi minimal 6 karakter
  const handleFormSubmit = (values: UserFormValues) => {
    const password = values.password ?? "";

    if (mode === "create" && password.length < 6) {
      setError("password", { message: "Password minimal 6 karakter." });
      return;
    }

    if (mode === "edit" && password.length > 0 && password.length < 6) {
      setError("password", { message: "Password minimal 6 karakter." });
      return;
    }

    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
              <UserCog size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#2f2f2f]">
                {mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
              </h2>
              <p className="text-xs text-[#777777]">
                Berlaku untuk akun Super Admin, Admin Sanggar, maupun User.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5] text-[#666666] transition hover:bg-[#eaeaea]"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#444444]">Email</span>
            <input
              {...register("email")}
              type="email"
              autoFocus
              maxLength={50}
              placeholder="nama@email.com"
              className={`h-[48px] w-full rounded-[16px] border bg-white px-4 text-sm outline-none transition focus:border-[#ff9800] ${
                errors.email ? "border-red-400" : "border-[#c9c9c9]"
              }`}
            />
            {errors.email && (
              <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#444444]">
              Password{" "}
              {mode === "edit" && (
                <span className="font-normal text-[#9a9a9a]">
                  (kosongkan jika tidak diganti)
                </span>
              )}
            </span>
            <input
              {...register("password")}
              type="password"
              placeholder={mode === "create" ? "Minimal 6 karakter" : "••••••••"}
              className={`h-[48px] w-full rounded-[16px] border bg-white px-4 text-sm outline-none transition focus:border-[#ff9800] ${
                errors.password ? "border-red-400" : "border-[#c9c9c9]"
              }`}
            />
            {errors.password && (
              <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#444444]">Role</span>
            <select
              {...register("role")}
              className={`h-[48px] w-full rounded-[16px] border bg-white px-4 text-sm outline-none transition focus:border-[#ff9800] ${
                errors.role ? "border-red-400" : "border-[#c9c9c9]"
              }`}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs font-semibold text-red-500">{errors.role.message}</p>
            )}
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] rounded-[14px] px-5 text-sm font-bold text-[#6b6b6b] transition hover:bg-[#f5f5f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[44px] items-center gap-2 rounded-[14px] bg-[#ff9800] px-6 text-sm font-bold text-white transition hover:bg-[#e88a00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {mode === "create" ? "Tambah Pengguna" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;