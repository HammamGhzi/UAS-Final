import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { ImagePlus, Loader2, PackagePlus, X } from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  emptyProductForm,
  productSchema,
  type ProductFormValues,
} from "@/pages/adminSanggar/productStore";
import { useProductCategories } from "@/pages/adminSanggar/useProducts";

type ProductFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: ProductFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
};

const ProductFormModal = ({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const [imageError, setImageError] = useState("");
  const { data: categories = [] } = useProductCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProductForm,
    mode: "onChange",
  });

  const image = watch("image");

  // Reset form setiap modal dibuka, baik mode create (kosong) atau edit (terisi).
  useEffect(() => {
    if (open) {
      reset(initialValues ?? emptyProductForm);
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
              <PackagePlus size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#2f2f2f]">
                {mode === "create" ? "Tambah Produk" : "Edit Produk"}
              </h2>
              <p className="text-sm text-[#777777]">
                Isi data sesuai field pada model produk.
              </p>
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
              <span className="text-[15px] font-bold text-[#444444]">Nama Produk</span>
              <input
                {...register("productName")}
                placeholder="Batik Tegalan Pesisir"
                className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                  errors.productName ? "border-red-400" : "border-[#bfc0c5]"
                }`}
              />
              {errors.productName && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.productName.message}
                </p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-[15px] font-bold text-[#444444]">Kategori</span>
              <select
                {...register("categoryId")}
                className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
                  errors.categoryId ? "border-red-400" : "border-[#bfc0c5]"
                }`}
              >
               <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </label>

            <Field
              label="Harga (Rp)"
              placeholder="185000"
              registration={register("price")}
              error={errors.price?.message}
            />
            <Field
              label="Stok"
              placeholder="12"
              registration={register("stock")}
              error={errors.stock?.message}
            />

            <div className="space-y-2 md:col-span-2">
              <span className="text-[15px] font-bold text-[#444444]">Gambar Produk</span>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#bfc0c5] bg-[#f7f8fd]">
                  {image ? (
                    <img src={image} alt="Preview produk" className="h-full w-full object-cover" />
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
            <span className="text-[15px] font-bold text-[#444444]">Deskripsi</span>
            <textarea
              {...register("description")}
              placeholder="Ceritakan detail produk batik ini"
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
              {mode === "create" ? "Simpan Produk" : "Simpan Perubahan"}
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
      inputMode="numeric"
      className={`h-[54px] w-full rounded-[18px] border bg-[#f7f8fd] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[#b6ec00] ${
        error ? "border-red-400" : "border-[#bfc0c5]"
      }`}
    />
    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
  </label>
);

export default ProductFormModal;