import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  PencilLine,
  Store,
  X,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  fieldLabels,
  getMissingSanggarFields,
  getStoredSanggarDraft,
  isSanggarBannerDismissed,
  isSanggarComplete,
  isSanggarSubmitted,
  saveSanggarDraft,
  setSanggarBannerDismissed,
  setSanggarSubmitted,
  type SanggarDraft,
} from "./sanggarDraft";

const stats = [
  { label: "Produk aktif", value: "0", icon: Package },
  { label: "Rating toko", value: "-", icon: CheckCircle2 },
];

const regions = [
  { id: "1", name: "Tegal Barat" },
  { id: "2", name: "Tegal Timur" },
  { id: "3", name: "Tegal Selatan" },
  { id: "4", name: "Margadana" },
  { id: "5", name: "Slawi" },
];

const AdminSanggarDashboard = () => {
  const [draft, setDraft] = useState<SanggarDraft>(() => getStoredSanggarDraft());
  const [submitted, setSubmitted] = useState(
    () => isSanggarSubmitted() && isSanggarComplete(getStoredSanggarDraft())
  );
  const [bannerDismissed, setBannerDismissed] = useState(() =>
    isSanggarBannerDismissed()
  );
  const [saved, setSaved] = useState(false);

  const missingFields = useMemo(() => getMissingSanggarFields(draft), [draft]);
  const complete = isSanggarComplete(draft);
  const showGreenBanner = submitted && complete && !bannerDismissed;

  const handleChange = (field: keyof SanggarDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmitStore = () => {
    saveSanggarDraft(draft);

    if (!complete) {
      setSaved(true);
      return;
    }

    setSubmitted(true);
    setSanggarSubmitted(true);
    setBannerDismissed(false);
    setSanggarBannerDismissed(false);
  };

  const handleEditStore = () => {
    setSubmitted(false);
    setSanggarSubmitted(false);
    setSaved(false);
  };

  const closeBanner = () => {
    setBannerDismissed(true);
    setSanggarBannerDismissed(true);
  };

  const today = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const selectedRegion =
    regions.find((region) => region.id === draft.regionId)?.name || "-";

  return (
    <div className="space-y-8">
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
              <p className="text-[25px] font-bold leading-tight">
                Hi, {draft.name}
              </p>
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {submitted && complete ? (
          <div className="overflow-visible rounded-[28px] border border-[#d6d6d6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {/* Cover */}
            <div className="relative h-[150px] w-full overflow-hidden rounded-t-[28px] bg-[linear-gradient(120deg,#ff9800,#ffb84d)]">
              {draft.image && (
                <img
                  src={draft.image}
                  alt={draft.name}
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/10" />

              <span className="absolute right-6 top-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-[#2f8f4e] shadow-sm">
                Toko Aktif
              </span>

              <Button
                type="button"
                onClick={handleEditStore}
                className="absolute bottom-5 right-6 rounded-full bg-white px-5 text-[#252525] shadow-md hover:bg-[#f2f2f2]"
              >
                <PencilLine size={16} />
                Edit Data
              </Button>
            </div>

            {/* Body - centered */}
            <div className="flex flex-col items-center px-8 pb-9 text-center">
              <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-white shadow-md">
                <Store size={30} className="text-[#ff9800]" />
              </div>

              <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-[#2f2f2f]">
                {draft.name}
              </h2>
              <p className="text-sm font-medium text-[#ff9800]">{selectedRegion}</p>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#666666]">
                {draft.description || "Sanggar batik siap dikelola."}
              </p>

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
          <div className="rounded-[28px] border border-[#d6d6d6] bg-white px-8 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-bold text-[#3e3e3e]">
                  Daftarkan Sanggar
                </h2>
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
                  value={draft.regionId}
                  onChange={(event) => handleChange("regionId", event.target.value)}
                  className="h-[58px] w-full rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
                >
                  <option value="">Pilih wilayah</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>

              <Field label="Nama Sanggar" value={draft.name} placeholder="Toko Batik Kaisar Gadai" onChange={(value) => handleChange("name", value)} />
              <Field label="Nama Pemilik" value={draft.ownerName} placeholder="Hammam" onChange={(value) => handleChange("ownerName", value)} />
              <Field label="Nomor HP" value={draft.phone} placeholder="08xxxxxxxxxx" onChange={(value) => handleChange("phone", value)} />
              <Field label="Latitude" value={draft.latitude} placeholder="-6.86940000" onChange={(value) => handleChange("latitude", value)} />
              <Field label="Longitude" value={draft.longitude} placeholder="109.14020000" onChange={(value) => handleChange("longitude", value)} />
              <Field label="URL Gambar" value={draft.image} placeholder="https://..." onChange={(value) => handleChange("image", value)} />
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-[17px] font-bold text-[#444444]">Alamat Lengkap</span>
              <textarea
                value={draft.address}
                onChange={(event) => handleChange("address", event.target.value)}
                placeholder="Jl. Batik Tegal No. 12"
                rows={3}
                className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
              />
            </label>

            <label className="mt-5 block space-y-2">
              <span className="text-[17px] font-bold text-[#444444]">Deskripsi</span>
              <textarea
                value={draft.description}
                onChange={(event) => handleChange("description", event.target.value)}
                placeholder="Ceritakan ciri khas sanggar batik anda"
                rows={3}
                className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium text-[#777777]">
                {complete
                  ? "Data wajib sudah lengkap. Silakan submit toko."
                  : `${missingFields.length} data wajib belum lengkap: ${missingFields
                      .map((field) => fieldLabels[field])
                      .join(", ")}`}
              </div>
              <Button
                type="button"
                onClick={handleSubmitStore}
                className="rounded-full bg-[#ff9800] px-7 text-white hover:bg-[#e48600]"
              >
                <PencilLine size={17} />
                Submit Toko
              </Button>
            </div>

            {saved && !complete && (
              <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-[#9b5a00]">
                Data sementara tersimpan, tapi toko belum aktif karena data wajib belum lengkap.
              </div>
            )}
          </div>
        )}

        <aside className="space-y-5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[26px] border border-[#d6d6d6] bg-white px-6 py-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#777777]">{item.label}</p>
                    <p className="mt-3 text-[34px] font-extrabold text-[#222222]">
                      {submitted && complete ? item.value : "-"}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-[26px] border border-[#d6d6d6] bg-white px-6 py-6">
            <ImagePlus className="text-[#ff9800]" size={28} />
            <h3 className="mt-4 text-xl font-bold text-[#333333]">
              {submitted && complete ? "Status Toko" : "Syarat Toko"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#777777]">
              {submitted && complete
                ? "Toko sudah aktif. Menu produk bisa digunakan untuk simulasi CRUD."
                : "Isi semua data wajib lalu submit supaya banner hijau dan card toko muncul."}
            </p>
          </div>

          <Link
            to={submitted && complete ? "/admin-sanggar/products" : "/admin-sanggar"}
            className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
              submitted && complete
                ? "bg-[#b6ec00] text-white hover:bg-[#9fd000]"
                : "bg-[#252525] text-white hover:bg-black"
            }`}
          >
            {submitted && complete ? <Package size={18} /> : <MapPin size={18} />}
            {submitted && complete ? "Kelola Produk" : "Lengkapi Data Toko"}
          </Link>
        </aside>
      </section>
    </div>
  );
};

const Field = ({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <label className="space-y-2">
    <span className="text-[17px] font-bold text-[#444444]">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-[58px] w-full rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
    />
  </label>
);

export default AdminSanggarDashboard;