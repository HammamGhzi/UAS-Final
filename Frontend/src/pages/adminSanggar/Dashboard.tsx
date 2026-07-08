import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import {
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  PencilLine,
  Phone,
  Store,
  User,
  X,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import { sanggarSchema, type SanggarFormValues } from "./sanggarDraft";
import { useMySanggar, useRegions, useCreateSanggar } from "./useMySanggar";

const stats = [
  { label: "Produk aktif", value: "0", icon: Package },
  { label: "Rating toko", value: "-", icon: CheckCircle2 },
];

const emptyFormValues: SanggarFormValues = {
  regionId: "",
  name: "",
  ownerName: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  description: "",
  image: "",
};

const AdminSanggarDashboard = () => {
  const { data: sanggar, isPending, isError } = useMySanggar();
  const { data: regions = [] } = useRegions();
  const createSanggar = useCreateSanggar();

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SanggarFormValues>({
    resolver: zodResolver(sanggarSchema),
    defaultValues: emptyFormValues,
    mode: "onChange",
  });

  const image = watch("image");
  const hasStore = Boolean(sanggar);
  const showGreenBanner = hasStore && !bannerDismissed;
  const isSaving = createSanggar.isPending;

  const handleImageFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar (jpg, png, dll).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Ukuran gambar maksimal 2MB.");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      setValue("image", reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true });
    setImageError("");
  };

  const onSubmitStore = (data: SanggarFormValues) => {
    setFormError("");
    createSanggar.mutate(data, {
      onSuccess: () => setBannerDismissed(false),
      onError: (err: any) => {
        setFormError(err?.response?.data?.message || "Gagal mendaftarkan sanggar.");
      },
    });
  };

  const closeBanner = () => setBannerDismissed(true);

  const today = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const selectedRegionName = sanggar?.region?.name || "-";

  if (isPending) {
    return <p className="text-center text-sm text-[#777777]">Memuat data toko...</p>;
  }

  if (isError) {
    return <p className="text-center text-sm text-red-500">Gagal memuat data toko.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {showGreenBanner && (
        <section className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(115deg,#0d9869,#2f554d)] px-10 py-9 text-white shadow-[0_24px_50px_rgba(28,76,61,0.16)] lg:px-[84px]">
          <button
            type="button"
            onClick={closeBanner}
            className="absolute right-7 top-7 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Tutup banner toko"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col gap-7 pr-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[25px] font-bold leading-tight">Hi, {sanggar?.name}</p>
              <h1 className="mt-6 max-w-[760px] text-[34px] font-extrabold leading-[1.38] tracking-normal lg:text-[37px]">
                Toko anda sudah aktif
                <br />
                Produk batik siap mulai dikelola
              </h1>
              <p className="mt-6 text-[20px] font-bold">
                Data toko sudah lengkap.{" "}
                <span className="text-[#ffd000]">CRUD produk sudah terbuka</span>
              </p>
            </div>
            <p className="text-[17px] font-medium">{today}</p>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[26px] border border-[#d6d6d6] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#777777]">{item.label}</p>
                    <p className="mt-3 text-[34px] font-extrabold leading-none text-[#222222]">
                      {hasStore ? item.value : "-"}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-[26px] border border-[#d6d6d6] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                <ImagePlus size={22} />
              </div>
              <Link
                to={hasStore ? "/admin-sanggar/products" : "/admin-sanggar"}
                className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition ${
                  hasStore
                    ? "bg-[#b6ec00] text-white hover:bg-[#9fd000]"
                    : "bg-[#252525] text-white hover:bg-black"
                }`}
              >
                {hasStore ? <Package size={15} /> : <MapPin size={15} />}
                {hasStore ? "Kelola Produk" : "Lengkapi Data"}
              </Link>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#333333]">
              {hasStore ? "Status Toko" : "Syarat Toko"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#777777]">
              {hasStore
                ? "Toko sudah aktif. Menu produk bisa digunakan untuk simulasi CRUD."
                : "Isi semua data wajib lalu submit supaya banner hijau dan card toko muncul."}
            </p>
          </div>
        </div>

        {hasStore && sanggar ? (
          <div className="overflow-visible rounded-[28px] border border-[#d6d6d6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between px-8 pt-6">
              <span className="rounded-full bg-[#eafaf0] px-4 py-1.5 text-xs font-bold text-[#2f8f4e]">
                Toko Aktif
              </span>
              {/* Edit sekarang diarahkan ke halaman Settings, bukan toggle form di sini */}
              <Link
                to="/admin-sanggar/settings"
                className="flex items-center gap-2 rounded-full border border-[#d6d6d6] bg-white px-5 py-2.5 text-sm font-bold text-[#252525] transition hover:bg-[#f5f5f5]"
              >
                <PencilLine size={16} />
                Edit Data
              </Link>
            </div>

            <div className="flex flex-col items-center px-8 pb-9 pt-6 text-center">
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-[#fff4df] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                {sanggar.image ? (
                  <img src={sanggar.image} alt={sanggar.name} className="h-full w-full object-cover" />
                ) : (
                  <Store size={30} className="text-[#ff9800]" />
                )}
              </div>

              <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-[#2f2f2f]">
                {sanggar.name}
              </h2>
              <p className="text-sm font-medium text-[#ff9800]">{selectedRegionName}</p>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#666666]">
                {sanggar.description || "Sanggar batik siap dikelola."}
              </p>

              <div className="mt-6 grid w-full max-w-lg gap-3 border-t border-[#eeeeee] pt-6 sm:grid-cols-3">
                <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#f7f8fa] px-4 py-3.5">
                  <User size={18} className="text-[#ff9800]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999999]">Pemilik</p>
                  <p className="text-sm font-bold text-[#333333]">{sanggar.ownerName || "-"}</p>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#f7f8fa] px-4 py-3.5">
                  <Phone size={18} className="text-[#ff9800]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999999]">Kontak</p>
                  <p className="text-sm font-bold text-[#333333]">{sanggar.phone || "-"}</p>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#f7f8fa] px-4 py-3.5">
                  <MapPin size={18} className="text-[#ff9800]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999999]">Alamat</p>
                  <p className="line-clamp-1 text-sm font-bold text-[#333333]" title={sanggar.address}>
                    {sanggar.address || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/admin-sanggar/products"
                  className="flex items-center gap-2 rounded-full bg-[#b6ec00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9fd000]"
                >
                  <Package size={17} />
                  Kelola Produk
                </Link>
                <Link
                  to="/admin-sanggar/settings"
                  className="flex items-center gap-2 rounded-full border border-[#d6d6d6] px-6 py-3 text-sm font-bold text-[#3e3e3e] transition hover:bg-[#f5f5f5]"
                >
                  Lihat Detail Toko
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmitStore)}
            className="rounded-[28px] border border-[#d6d6d6] bg-white px-8 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-bold text-[#3e3e3e]">Daftarkan Sanggar</h2>
                <p className="mt-1 text-sm text-[#777777]">
                  Lengkapi data sesuai model sanggar. Setelah submit, form ini berubah jadi card toko.
                </p>
              </div>
              <Store className="text-[#ff9800]" size={30} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[17px] font-bold text-[#444444]">Wilayah</span>
                <select
                  {...register("regionId")}
                  className={`h-[58px] w-full rounded-[22px] border bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                    errors.regionId ? "border-red-400" : "border-[#bfc0c5]"
                  }`}
                >
                  <option value="">Pilih wilayah</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className="text-xs font-semibold text-red-500">{errors.regionId.message}</p>
                )}
              </label>

              <Field label="Nama Sanggar" placeholder="Toko Batik Kaisar Gadai" registration={register("name")} error={errors.name?.message} />
              <Field label="Nama Pemilik" placeholder="Hammam" registration={register("ownerName")} error={errors.ownerName?.message} />
              <Field label="Nomor HP" placeholder="08xxxxxxxxxx" registration={register("phone")} error={errors.phone?.message} />
              <Field label="Latitude" placeholder="-6.86940000" registration={register("latitude")} error={errors.latitude?.message} />
              <Field label="Longitude" placeholder="109.14020000" registration={register("longitude")} error={errors.longitude?.message} />

              <div className="space-y-2 md:col-span-2">
                <span className="text-[17px] font-bold text-[#444444]">Foto Sanggar</span>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd]">
                    {image ? (
                      <img src={image} alt="Preview toko" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus size={26} className="text-[#a8a8a8]" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#252525] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black">
                        <ImagePlus size={16} />
                        {image ? "Ganti Foto" : "Upload Foto"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImageFile(event.target.files?.[0])}
                        />
                      </label>
                      {image && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="rounded-full border border-[#d6d6d6] px-5 py-2.5 text-sm font-bold text-[#666666] transition hover:bg-[#f5f5f5]"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#888888]">Format JPG/PNG, maksimal 2MB.</p>
                    {imageError && <p className="text-xs font-semibold text-red-500">{imageError}</p>}
                  </div>
                </div>
              </div>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-[17px] font-bold text-[#444444]">Alamat Lengkap</span>
              <textarea
                {...register("address")}
                placeholder="Jl. Batik Tegal No. 12"
                rows={3}
                className={`w-full resize-none rounded-[22px] border bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                  errors.address ? "border-red-400" : "border-[#bfc0c5]"
                }`}
              />
              {errors.address && <p className="text-xs font-semibold text-red-500">{errors.address.message}</p>}
            </label>

            <label className="mt-5 block space-y-2">
              <span className="text-[17px] font-bold text-[#444444]">Deskripsi</span>
              <textarea
                {...register("description")}
                placeholder="Ceritakan ciri khas sanggar batik anda"
                rows={3}
                className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium text-[#777777]">
                {Object.keys(errors).length === 0
                  ? "Data wajib sudah lengkap. Silakan submit toko."
                  : "Cek lagi data yang masih merah di atas."}
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-[#ff9800] px-7 text-white hover:bg-[#e48600] disabled:opacity-70"
              >
                <PencilLine size={17} />
                {isSaving ? "Menyimpan..." : "Submit Toko"}
              </Button>
            </div>

            {formError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
                {formError}
              </div>
            )}
          </form>
        )}
      </section>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  registration,
  error,
}: {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) => (
  <label className="space-y-2">
    <span className="text-[17px] font-bold text-[#444444]">{label}</span>
    <input
      {...registration}
      placeholder={placeholder}
      className={`h-[58px] w-full rounded-[22px] border bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
        error ? "border-red-400" : "border-[#bfc0c5]"
      }`}
    />
  </label>
);

export default AdminSanggarDashboard;