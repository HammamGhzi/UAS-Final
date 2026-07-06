import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, Store, UserRound } from "lucide-react";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import {
  saveSanggarDraft,
  setSanggarBannerDismissed,
  setSanggarSubmitted,
  emptySanggarDraft,
} from "../adminSanggar/sanggarDraft";

const roles = [
  {
    value: "ADMIN",
    title: "Admin Sanggar",
    description: "Buat dan kelola toko",
    icon: Store,
  },
  {
    value: "USER",
    title: "User Biasa",
    description: "Cari dan ulas batik",
    icon: UserRound,
  },
] as const;

const registerSchema = z.object({
  email: z.string().min(1, "Email wajib diisi.").email("Format email belum valid."),
  role: z.enum(["ADMIN", "USER"]),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

type RegisterForm = z.infer<typeof registerSchema>;

const AdminRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      role: "ADMIN",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterForm) => {
    if (data.role === "ADMIN") {
      // Akun sanggar dibuat tanpa data toko dulu.
      // Data toko baru diisi nanti di halaman dashboard admin-sanggar
      // (form otomatis muncul selama toko belum lengkap / belum di-submit).
      saveSanggarDraft(emptySanggarDraft);
      setSanggarSubmitted(false);
      setSanggarBannerDismissed(false);
      navigate("/admin-sanggar");
      return;
    }

    setSuccess(
      `Desain register siap. Akun ${data.email} akan dibuat sebagai ${roles.find((role) => role.value === data.role)?.title}.`
    );
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
        <section className="relative flex min-h-[690px] w-full max-w-[1100px] items-center justify-center overflow-hidden rounded-[34px] bg-[#fde9d6] px-5 py-10 shadow-[0_28px_90px_rgba(121,91,68,0.14)] sm:px-10">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#8b5f31] shadow-sm transition hover:-translate-x-0.5 hover:bg-white hover:text-[#583822] sm:left-8 sm:top-8"
            aria-label="Kembali ke halaman login"
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

          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-[#fff7ef]/76 px-7 py-9 shadow-[0_24px_80px_rgba(88,56,34,0.18)] backdrop-blur-[7px] sm:px-9 sm:py-10">
            <img
              src="/login1.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-20 blur-[6px]"
            />

            <div className="relative">
              <h1 className="text-center text-[36px] font-bold leading-none tracking-normal text-[#333333]">
                Register
              </h1>
              <p className="mt-2 text-center text-xs font-medium text-[#6f6258]">
                Pilih tipe akun yang sesuai dengan kebutuhanmu
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const active = selectedRole === role.value;

                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setValue("role", role.value, { shouldValidate: true });
                          setSuccess("");
                        }}
                        className={`min-h-[84px] rounded-xl border px-2.5 py-3 text-left transition ${
                          active
                            ? "border-[#b6ec00] bg-white shadow-[0_12px_30px_rgba(154,106,58,0.12)]"
                            : "border-white/70 bg-white/55 hover:bg-white/80"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={active ? "text-[#6aa300]" : "text-[#8b5f31]"}
                        />
                        <span className="mt-2 block text-[11px] font-bold text-[#3f342c]">
                          {role.title}
                        </span>
                        <span className="mt-1 block text-[10px] leading-tight text-[#7b6b5d]">
                          {role.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input type="hidden" {...register("role")} />
                {errors.role && (
                  <p className="text-xs text-red-500">{errors.role.message}</p>
                )}

                {/* Field di bawah ini SAMA untuk ADMIN (Admin Sanggar) maupun USER (User Biasa).
                    Disesuaikan dengan model User di Prisma: cuma email, password, role.
                    Data toko/sanggar untuk ADMIN diisi belakangan di dashboard admin-sanggar. */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4b423b]">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="nama@gmail.com"
                    {...register("email", { onChange: () => setSuccess("") })}
                    error={errors.email?.message}
                    className="h-[32px] rounded-md border-0 bg-white/95 px-4 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
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
                      {...register("password", { onChange: () => setSuccess("") })}
                      error={errors.password?.message}
                      className="h-[32px] rounded-md border-0 bg-white/95 px-4 pr-10 text-xs text-brown-900 shadow-none placeholder:text-brown-200 focus:ring-2 focus:ring-[#b4ed00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-4 text-brown-300 transition hover:text-brown-700"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>

                {success && (
                  <div className="rounded-lg border border-lime-200 bg-lime-50/90 px-4 py-2 text-xs font-medium text-[#5f8f00]">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-5 h-[32px] w-full rounded-full bg-[#b6ec00] py-0 text-xs font-bold text-white shadow-none hover:bg-[#9fd000]"
                >
                  Buat Akun
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-[#4b423b]">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/form/login")}
                  className="font-bold text-[#6aa300] transition hover:text-[#4d7a00]"
                >
                  Masuk Disini
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminRegister;