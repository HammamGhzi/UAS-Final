import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { adminApi } from "../../services/api";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.login(form);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
      } else {
        setError("Login gagal. Token tidak ditemukan.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Username atau password salah.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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

          <div className="relative w-full max-w-[350px] overflow-hidden rounded-[28px] bg-[#fff7ef]/72 px-8 py-10 shadow-[0_24px_80px_rgba(88,56,34,0.18)] backdrop-blur-[7px] sm:px-9 sm:py-11">
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

              <form onSubmit={handleSubmit} className="mt-8 space-y-3.5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                    Email
                  </label>
                  <Input
                    name="username"
                    type="text"
                    placeholder="username@gmail.com"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-[30px] rounded-md border-0 bg-white/95 px-4 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
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

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50/90 px-4 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-6 h-[30px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <div className="mt-5 text-center text-xs text-[#4b423b]">
                Atau masuk dengan
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Masuk dengan Google"
                  className="flex h-[26px] w-[58px] items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-base font-bold text-[#4285f4]">G</span>
                </button>
                <button
                  type="button"
                  aria-label="Masuk dengan Facebook"
                  className="flex h-[26px] w-[58px] items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1da1f2] text-xs font-bold leading-none text-white">
                    f
                  </span>
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-[#4b423b]">
                Belum punya akun?{" "}
                <span className="font-bold text-[#6aa300]">Daftar Disini</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
