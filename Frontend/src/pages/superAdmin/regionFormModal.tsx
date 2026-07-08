import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, MapPin, X } from "lucide-react";
import { regionSchema, emptyRegionForm, type RegionFormValues } from "@/pages/superAdmin/RegionStore";

type RegionFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: RegionFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: RegionFormValues) => void;
};

const RegionFormModal = ({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: RegionFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: emptyRegionForm,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(initialValues ?? emptyRegionForm);
  }, [open, initialValues, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#2f2f2f]">
                {mode === "create" ? "Tambah Wilayah" : "Edit Wilayah"}
              </h2>
              <p className="text-xs text-[#777777]">Sesuai field model Region di backend.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5] text-[#666666] transition hover:bg-[#eaeaea]"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#444444]">Nama Wilayah</span>
            <input
              {...register("name")}
              autoFocus
              maxLength={100}
              placeholder="mis. Tegal Barat"
              className={`h-[48px] w-full rounded-[16px] border bg-white px-4 text-sm outline-none transition focus:border-[#ff9800] ${
                errors.name ? "border-red-400" : "border-[#c9c9c9]"
              }`}
            />
            {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] rounded-[14px] px-5 text-sm font-bold text-[#6b6b6b] transition hover:bg-[#f5f5f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[44px] items-center gap-2 rounded-[14px] bg-[#ff9800] px-6 text-sm font-bold text-white transition hover:bg-[#e88a00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {mode === "create" ? "Tambah Wilayah" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegionFormModal;