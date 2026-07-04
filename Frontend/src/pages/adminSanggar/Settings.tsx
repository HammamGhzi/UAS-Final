import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { CheckCircle2, ImagePlus, MapPinned, Save, Store } from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  getStoredSanggarDraft,
  saveSanggarDraft,
  sanggarSchema,
  type SanggarFormValues,
} from "./sanggarDraft";

const regions = [
  { id: "1", name: "Tegal Barat" },
  { id: "2", name: "Tegal Timur" },
  { id: "3", name: "Tegal Selatan" },
  { id: "4", name: "Margadana" },
  { id: "5", name: "Slawi" },
];

const AdminSanggarSettings = () => {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SanggarFormValues>({
    resolver: zodResolver(sanggarSchema),
    defaultValues: getStoredSanggarDraft(),
    mode: "onChange",
  });

  const image = watch("image");
  const complete = Object.keys(errors).length === 0;

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
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true });
    setImageError("");
    setSaved(false);
  };

  const onSubmit = (data: SanggarFormValues) => {
    saveSanggarDraft(data);
    setSaved(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[28px] border border-[#dedede] bg-white px-8 py-7">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Setelan Sanggar</h1>
            <p className="mt-1 text-sm text-[#777777]">
              Data ini disiapkan agar nanti pas dengan tabel `sanggars`.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
            <Store size={28} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[17px] font-bold text-[#444444]">Wilayah</span>
              <select
                {...register("regionId", { onChange: () => setSaved(false) })}
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

            <Field
              label="Nama Sanggar"
              registration={register("name", { onChange: () => setSaved(false) })}
              error={errors.name?.message}
            />
            <Field
              label="Nama Pemilik"
              registration={register("ownerName", { onChange: () => setSaved(false) })}
              error={errors.ownerName?.message}
            />
            <Field
              label="Nomor HP"
              registration={register("phone", { onChange: () => setSaved(false) })}
              error={errors.phone?.message}
            />
            <Field
              label="Latitude"
              registration={register("latitude", { onChange: () => setSaved(false) })}
              error={errors.latitude?.message}
            />
            <Field
              label="Longitude"
              registration={register("longitude", { onChange: () => setSaved(false) })}
              error={errors.longitude?.message}
            />

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
                  <p className="text-xs text-[#888888]">
                    Format JPG/PNG, maksimal 2MB. Disimpan langsung di perangkat ini.
                  </p>
                  {imageError && (
                    <p className="text-xs font-semibold text-red-500">{imageError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-[17px] font-bold text-[#444444]">Alamat Lengkap</span>
            <textarea
              {...register("address", { onChange: () => setSaved(false) })}
              rows={3}
              className={`w-full resize-none rounded-[22px] border bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                errors.address ? "border-red-400" : "border-[#bfc0c5]"
              }`}
            />
            {errors.address && (
              <p className="text-xs font-semibold text-red-500">{errors.address.message}</p>
            )}
          </label>

          <label className="mt-5 block space-y-2">
            <span className="text-[17px] font-bold text-[#444444]">Deskripsi</span>
            <textarea
              {...register("description", { onChange: () => setSaved(false) })}
              rows={4}
              className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
            />
          </label>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#777777]">
              {complete ? "Data wajib sudah lengkap." : "Cek lagi data yang masih merah di atas."}
            </p>
            <Button
              type="submit"
              className="rounded-full bg-[#ff9800] px-7 text-white hover:bg-[#e48600]"
            >
              <Save size={17} />
              Simpan Setelan
            </Button>
          </div>
        </form>

        {saved && (
          <div className="mt-4 rounded-2xl border border-lime-200 bg-lime-50 px-5 py-3 text-sm font-semibold text-[#5f8f00]">
            Setelan sanggar berhasil disimpan di local frontend.
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <div className="rounded-[28px] border border-[#dedede] bg-white px-7 py-7">
          <CheckCircle2 className={complete ? "text-[#6aa300]" : "text-[#ff9800]"} size={30} />
          <h2 className="mt-5 text-xl font-extrabold text-[#333333]">
            {complete ? "Toko Siap Aktif" : "Syarat Toko"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#777777]">
            CRUD produk hanya dibuka setelah wilayah, nama sanggar, pemilik, alamat, latitude,
            dan longitude terisi dengan format yang benar.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#dedede] bg-white px-7 py-7">
          <MapPinned className="text-[#ff9800]" size={30} />
          <h2 className="mt-5 text-xl font-extrabold text-[#333333]">Lokasi</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#777777]">
            Latitude dan longitude disiapkan untuk map sanggar dan perhitungan jarak rekomendasi.
          </p>
        </div>
      </aside>
    </div>
  );
};

const Field = ({
  label,
  registration,
  error,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) => (
  <label className="space-y-2">
    <span className="text-[17px] font-bold text-[#444444]">{label}</span>
    <input
      {...registration}
      className={`h-[58px] w-full rounded-[22px] border bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
        error ? "border-red-400" : "border-[#bfc0c5]"
      }`}
    />
    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
  </label>
);

export default AdminSanggarSettings;