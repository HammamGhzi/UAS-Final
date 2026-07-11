import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { authApi } from "../../services/api";
import { useAuthStore } from "../../stores/useAuthStore";
import type { LoginResponse } from "../../types/auth";
import { Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";
import {
  LoginStatusOverlay,
  ShakeWrapper,
} from "../../components/UI/LoginStatusOverlay";
import {
  AuthLayout,
  authButtonClass,
  authInputClass,
  authLinkClass,
} from "../../components/layouts/AuthLayout";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email belum valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

type LoginForm = z.infer<typeof loginSchema>;

type ErrorResponse = { message?: string };

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [pendingResult, setPendingResult] = useState<LoginResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await authApi.login({
        email: data.username,
        password: data.password,
      });
      return res.data.data as LoginResponse;
    },
    onSuccess: (result) => {
      setError("");
      login({ user: result.user, token: result.token });
      setPendingResult(result);
      setShowSuccess(true);
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Email atau password salah.";
      setError(msg);
      setShowErrorPopup(true);
      setShakeKey((k) => k + 1);
    },
  });

  const handleSuccessDone = () => {
    setShowSuccess(false);
    if (!pendingResult) return;

    switch (pendingResult.user.role) {
      case "SUPER_ADMIN":
        navigate("/super-admin");
        break;
      case "ADMIN":
        navigate("/admin-sanggar");
        break;
      case "USER":
      default:
        navigate("/");
        break;
    }
  };

  const handleErrorPopupDone = () => {
    setShowErrorPopup(false);
  };

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <AuthLayout
        headline="Selamat Datang Kembali"
        description="Masuk ke akun Canting untuk menjelajahi koleksi batik Tegal, mengelola sanggar, atau memberikan ulasan produk favoritmu."
        backTo="/"
        footer={
          <p className="text-sm text-white/55">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/form/register")}
              className={authLinkClass}
            >
              Daftar Disini
            </button>
          </p>
        }
      >
        <ShakeWrapper triggerKey={shakeKey}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <Input
                type="text"
                placeholder="username@gmail.com"
                {...register("username", {
                  onChange: () => setError(""),
                })}
                disabled={loginMutation.isPending}
                error={errors.username?.message}
                className={authInputClass}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    onChange: () => setError(""),
                  })}
                  disabled={loginMutation.isPending}
                  error={errors.password?.message}
                  className={`${authInputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/80"
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => navigate("/form/forgot-password")}
                className="text-sm text-white/55 transition hover:text-[#c4a882]"
              >
                Lupa Sandi?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={authButtonClass}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </ShakeWrapper>
      </AuthLayout>

      <LoginStatusOverlay
        show={showSuccess}
        variant="success"
        message="Login berhasil! Mengalihkan..."
        onDone={handleSuccessDone}
      />

      <LoginStatusOverlay
        show={showErrorPopup}
        variant="error"
        message="Login gagal"
        subMessage={error}
        duration={3000}
        onDone={handleErrorPopupDone}
      />
    </>
  );
};

export default AdminLogin;
