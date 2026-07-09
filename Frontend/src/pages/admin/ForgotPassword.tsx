import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { authApi } from "../../services/api";

type ErrorResponse = { message?: string };
type Step = "email" | "otp" | "reset" | "done";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.forgotPassword({ email });
      return res.data;
    },
    onSuccess: () => {
      setErrorMsg("");
      setStep("otp");
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      setErrorMsg(err.response?.data?.message || "Gagal mengirim OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.verifyOtp({ email, otp });
      return res.data;
    },
    onSuccess: () => {
      setErrorMsg("");
      setStep("reset");
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      setErrorMsg(err.response?.data?.message || "Kode OTP salah");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.resetPassword({ email, otp, newPassword });
      return res.data;
    },
    onSuccess: () => {
      setErrorMsg("");
      setStep("done");
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      setErrorMsg(err.response?.data?.message || "Gagal reset password");
    },
  });

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setErrorMsg("Email wajib diisi");
    sendOtpMutation.mutate();
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return setErrorMsg("Kode OTP harus 6 digit");
    verifyOtpMutation.mutate();
  };

  const handleSubmitReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return setErrorMsg("Password minimal 6 karakter");
    if (newPassword !== confirmPassword)
      return setErrorMsg("Konfirmasi password tidak cocok");
    resetPasswordMutation.mutate();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff7df] px-4 py-8 sm:px-8 lg:px-14">
      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <section className="relative flex min-h-[560px] w-full max-w-[1100px] items-center justify-center overflow-hidden rounded-[34px] bg-[#fde9d6] px-5 py-10 shadow-[0_28px_90px_rgba(121,91,68,0.14)] sm:px-10">
          <button
            type="button"
            onClick={() => navigate("/form/login")}
            className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#8b5f31] shadow-sm transition hover:-translate-x-0.5 hover:bg-white hover:text-[#583822] sm:left-8 sm:top-8"
            aria-label="Kembali ke login"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="relative w-full max-w-[380px] overflow-hidden rounded-[28px] bg-[#fff7ef]/72 px-8 py-10 shadow-[0_24px_80px_rgba(88,56,34,0.18)] backdrop-blur-[7px] sm:px-9 sm:py-11">
            {step === "email" && (
              <>
                <h1 className="text-center text-2xl font-bold text-[#333333]">
                  Lupa Password
                </h1>
                <p className="mt-2 text-center text-xs text-[#777]">
                  Masukkan email akun kamu, kami akan kirim kode OTP.
                </p>

                <form onSubmit={handleSubmitEmail} className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="username@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg("");
                      }}
                      className="h-[38px] rounded-md border-0 bg-white/95 px-4 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-center text-xs text-red-500">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-4 h-[38px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Mengirim..." : "Kirim Kode OTP"}
                  </Button>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <h1 className="text-center text-2xl font-bold text-[#333333]">
                  Verifikasi OTP
                </h1>
                <p className="mt-2 text-center text-xs text-[#777]">
                  Kode OTP telah dikirim ke <b>{email}</b>. Berlaku 10 menit.
                </p>

                <form onSubmit={handleSubmitOtp} className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                      Kode OTP
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setErrorMsg("");
                      }}
                      className="h-[38px] rounded-md border-0 bg-white/95 px-4 text-center text-lg tracking-[6px] text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-center text-xs text-red-500">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-4 h-[38px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={verifyOtpMutation.isPending}
                  >
                    {verifyOtpMutation.isPending ? "Memverifikasi..." : "Verifikasi"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => sendOtpMutation.mutate()}
                    disabled={sendOtpMutation.isPending}
                    className="w-full text-center text-xs font-medium text-[#bd6b16] transition hover:text-[#8b4b10]"
                  >
                    Kirim Ulang Kode
                  </button>
                </form>
              </>
            )}

            {step === "reset" && (
              <>
                <h1 className="text-center text-2xl font-bold text-[#333333]">
                  Password Baru
                </h1>
                <p className="mt-2 text-center text-xs text-[#777]">
                  Buat password baru untuk akun kamu.
                </p>

                <form onSubmit={handleSubmitReset} className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setErrorMsg("");
                        }}
                        className="h-[38px] rounded-md border-0 bg-white/95 px-4 pr-10 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((c) => !c)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-300 transition hover:text-brown-700"
                      >
                        {showPassword ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                      Konfirmasi Password
                    </label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMsg("");
                      }}
                      className="h-[38px] rounded-md border-0 bg-white/95 px-4 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-center text-xs text-red-500">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-4 h-[38px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Menyimpan..." : "Simpan Password Baru"}
                  </Button>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#333333]">Berhasil!</h1>
                <p className="mt-2 text-xs text-[#777]">
                  Password kamu berhasil diubah. Silakan login dengan password baru.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/form/login")}
                  className="mt-6 h-[38px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000]"
                >
                  Ke Halaman Login
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotPassword;