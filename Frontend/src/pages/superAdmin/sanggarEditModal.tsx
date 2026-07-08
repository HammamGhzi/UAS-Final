import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { ImagePlus, Loader2, Store, X } from "lucide-react";
import { Button } from "@/components/UI/Button";
import {
  emptySanggarEditForm,
  sanggarEditSchema,
  type SanggarEditFormValues,
} from "@/pages/superAdmin/sanggarEditStore";

type RegionOption = { id: number; name: string };

type SanggarEditModalProps = {
  open: boolean;
  initialValues?: SanggarEditFormValues;
  regions: RegionOption[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SanggarEditFormValues) => void;
};

const SanggarEditModal = ({
  open,
  initialValues,
  regions,
  isSubmitting = false,
  onClose,
  onSubmit,
}: SanggarEditModalProps) => {
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SanggarEditFormValues>({
    resolver: zodResolver(sanggarEditSchema),
    defaultValues: emptySanggarEditForm,
    mode: "onChange",
  });

  const image = watch("image");

  // Reset form tiap modal dibuka, terisi data sanggar yang sedang diedit.
  useEffect(() => {
    if (open) {
      reset(initialValues ?? emptySanggarEditForm);
      setImageError("");
    }
  }, [open, initialValues, reset]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white px-8 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#2f2f2f]">Edit Sanggar</h2>
              <p className="text-sm text-[#777777]">Ubah data sanggar sesuai kebutuhan.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#666666] transition hover:bg-[#eaeaea]"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-[15px] font-bold text-[#444444]">Nama Sanggar</span>
              <input
                {...register("name")}
                placeholder="Sanggar Batik Harimau"
                className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                  errors.name ? "border-red-400" : "border-[#bfc0c5]"
                }`}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-[15px] font-bold text-[#444444]">Wilayah</span>
              <select
                {...register("regionId")}
                className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
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
              label="Nama Pemilik"
              placeholder="Hammam"
              registration={register("ownerName")}
              error={errors.ownerName?.message}
            />
            <Field
              label="No. Telepon"
              placeholder="081234567890"
              registration={register("phone")}
              error={errors.phone?.message}
            />

            <Field
              label="Latitude"
              placeholder="-6.869"
              registration={register("latitude")}
              error={errors.latitude?.message}
            />
            <Field
              label="Longitude"
              placeholder="109.140"
              registration={register("longitude")}
              error={errors.longitude?.message}
            />

            <label className="space-y-2 md:col-span-2">
              <span className="text-[15px] font-bold text-[#444444]">Alamat</span>
              <textarea
                {...register("address")}
                placeholder="Jl. Batik No. 1, Tegal"
                rows={2}
                className={`w-full resize-none rounded-[18px] border bg-[#f7f8fd] px-5 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                  errors.address ? "border-red-400" : "border-[#bfc0c5]"
                }`}
              />
              {errors.address && (
                <p className="text-xs font-semibold text-red-500">{errors.address.message}</p>
              )}
            </label>

            <div className="space-y-2 md:col-span-2">
              <span className="text-[15px] font-bold text-[#444444]">Foto Sanggar</span>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#bfc0c5] bg-[#f7f8fd]">
                  {image ? (
                    <img src={image} alt="Preview sanggar" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus size={22} className="text-[#a8a8a8]" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#252525] px-4 py-2 text-sm font-bold text-white transition hover:bg-black">
                      <ImagePlus size={15} />
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
                        className="rounded-full border border-[#d6d6d6] px-4 py-2 text-sm font-bold text-[#666666] transition hover:bg-[#f5f5f5]"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#888888]">Format JPG/PNG, maksimal 2MB.</p>
                  {imageError && (
                    <p className="text-xs font-semibold text-red-500">{imageError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-[15px] font-bold text-[#444444]">Deskripsi</span>
            <textarea
              {...register("description")}
              placeholder="Ceritakan tentang sanggar ini"
              rows={3}
              className="w-full resize-none rounded-[18px] border border-[#bfc0c5] bg-[#f7f8fd] px-5 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
            />
          </label>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d6d6d6] bg-white px-6 text-[#3e3e3e] hover:bg-[#f5f5f5]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#ff9800] px-7 text-white hover:bg-[#e48600] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
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
    <span className="text-[15px] font-bold text-[#444444]">{label}</span>
    <input
      {...registration}
      placeholder={placeholder}
      className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
        error ? "border-red-400" : "border-[#bfc0c5]"
      }`}
    />
    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
  </label>
);

export default SanggarEditModal;