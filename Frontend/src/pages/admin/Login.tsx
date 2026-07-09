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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";
import {
  LoginStatusOverlay,
  ShakeWrapper,
} from "../../components/UI/LoginStatusOverlay";

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
    <div className="relative min-h-screen overflow-hidden bg-[#fff7df] px-4 py-8 sm:px-8 lg:px-14">
      <img
        src="/login2.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 w-[300px] opacity-25 blur-[3px] sm:w-[430px] lg:-left-24 lg:w-[560px]"
      />

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <section className="relative flex min-h-[620px] w-full max-w-[1100px] items-center justify-center overflow-hidden rounded-[34px] bg-[#fde9d6] px-5 py-10 shadow-[0_28px_90px_rgba(121,91,68,0.14)] sm:px-10 lg:min-h-[686px]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#8b5f31] shadow-sm transition hover:-translate-x-0.5 hover:bg-white hover:text-[#583822] sm:left-8 sm:top-8"
            aria-label="Kembali ke halaman utama"
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src="/login1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[1040px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-52"
          />

          <div className="absolute left-1/2 top-14 h-9 w-9 -translate-x-1/2 rounded-full bg-[#9a6a3a] opacity-80" />

          <ShakeWrapper
            triggerKey={shakeKey}
            className="relative w-full max-w-[350px] overflow-hidden rounded-[28px] bg-[#fff7ef]/72 px-8 py-10 shadow-[0_24px_80px_rgba(88,56,34,0.18)] backdrop-blur-[7px] sm:px-9 sm:py-11"
          >
            <img
              src="/login1.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-20 blur-[6px]"
            />

            <div className="relative">
              <h1 className="text-center text-[38px] font-bold leading-none tracking-normal text-[#333333]">
                Login
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3.5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                    Email
                  </label>
                  <Input
                    type="text"
                    placeholder="username@gmail.com"
                    {...register("username", {
                      onChange: () => setError(""),
                    })}
                    disabled={loginMutation.isPending}
                    error={errors.username?.message}
                    className="h-[30px] rounded-md border-0 bg-white/95 px-4 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password", {
                        onChange: () => setError(""),
                      })}
                      disabled={loginMutation.isPending}
                      error={errors.password?.message}
                      className="h-[30px] rounded-md border-0 bg-white/95 px-4 pr-10 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-300 transition hover:text-brown-700"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs font-medium text-[#bd6b16] transition hover:text-[#8b4b10]"
                  >
                    Lupa Sandi?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-6 h-[30px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-[#4b423b]">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/form/register")}
                  className="font-bold text-[#6aa300] transition hover:text-[#4d7a00]"
                >
                  Daftar Disini
                </button>
              </p>
            </div>
          </ShakeWrapper>
        </section>
      </main>

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
    </div>
  );
};

export default AdminLogin;