import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import type { AxiosError } from "axios";
import { Eye, EyeOff, Store, UserRound } from "lucide-react";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { authApi } from "../../services/api";
import { useAuthStore } from "../../stores/useAuthStore";
import type { LoginResponse } from "../../types/auth";
import {
  saveSanggarDraft,
  setSanggarBannerDismissed,
  setSanggarSubmitted,
  emptySanggarDraft,
} from "../adminSanggar/sanggarDraft";
import {
  AuthLayout,
  authButtonClass,
  authInputClass,
  authLinkClass,
} from "../../components/layouts/AuthLayout";

const roles = [
  { value: "ADMIN", title: "Admin Sanggar", description: "Buat dan kelola toko", icon: Store },
  { value: "USER", title: "User Biasa", description: "Cari dan ulas batik", icon: UserRound },
] as const;

const registerSchema = z.object({
  email: z.string().min(1, "Email wajib diisi.").email("Format email belum valid."),
  role: z.enum(["ADMIN", "USER"]),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

type RegisterForm = z.infer<typeof registerSchema>;
type ErrorResponse = { message?: string };

const AdminRegister = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", role: "ADMIN", password: "" },
  });

  const selectedRole = watch("role");

  // Sesuai pola Pertemuan 10: register pakai useMutation, lalu langsung login
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      // 1. Daftar ke backend (authController.register) -> password di-hash di server pakai bcrypt
      await authApi.register({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // 2. Langsung login supaya dapat token JWT (authController.login)
      const res = await authApi.login({
        email: data.email,
        password: data.password,
      });
      return res.data.data as LoginResponse;
    },
    onSuccess: (result) => {
      setErrorMsg("");
      login({ user: result.user, token: result.token });

      if (result.user.role === "ADMIN") {
        saveSanggarDraft(emptySanggarDraft);
        setSanggarSubmitted(false);
        setSanggarBannerDismissed(false);
        navigate("/admin-sanggar");
      } else {
        navigate("/");
      }
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const msg =
        err.response?.data?.message || err.message || "Registrasi gagal, coba lagi.";
      setErrorMsg(msg);
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthLayout
      headline="Buat Akun Baru"
      description="Bergabung dengan Canting untuk mengelola sanggar batik atau menemukan koleksi batik Tegal terbaik sesuai kebutuhanmu."
      backTo="/form/login"
      backLabel="Kembali ke halaman login"
      footer={
        <p className="text-sm text-white/55">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/form/login")}
            className={authLinkClass}
          >
            Masuk Disini
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = selectedRole === role.value;

            return (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  setValue("role", role.value, { shouldValidate: true });
                  setErrorMsg("");
                }}
                className={`min-h-[76px] rounded-2xl border px-2.5 py-2.5 text-left transition sm:min-h-[88px] sm:px-3 sm:py-3 ${
                  active
                    ? "border-[#9c8360] bg-[#2d1f14] shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                    : "border-white/10 bg-[#241810] hover:border-white/20 hover:bg-[#2a1a12]"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-[#c4a882]" : "text-white/50"}
                />
                <span className="mt-2 block text-xs font-bold text-white">
                  {role.title}
                </span>
                <span className="mt-1 block text-[11px] leading-tight text-white/45">
                  {role.description}
                </span>
              </button>
            );
          })}
        </div>

        <input type="hidden" {...register("role")} />
        {errors.role && (
          <p className="text-xs text-red-400">{errors.role.message}</p>
        )}

        {/* Field di bawah ini SAMA untuk ADMIN (Admin Sanggar) maupun USER (User Biasa).
            Disesuaikan dengan model User di Prisma: cuma email, password, role.
            Data toko/sanggar untuk ADMIN diisi belakangan di dashboard admin-sanggar. */}
        <div>
          <Input
            type="email"
            placeholder="nama@gmail.com"
            {...register("email", { onChange: () => setErrorMsg("") })}
            disabled={registerMutation.isPending}
            error={errors.email?.message}
            className={authInputClass}
          />
        </div>

        <div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { onChange: () => setErrorMsg("") })}
              disabled={registerMutation.isPending}
              error={errors.password?.message}
              className={`${authInputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/80"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-2.5 text-xs font-medium text-red-300">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={registerMutation.isPending}
          className={authButtonClass}
        >
          {registerMutation.isPending ? "Memproses..." : "Buat Akun"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminRegister;
