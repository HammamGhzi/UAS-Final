import { useMemo, useState } from "react";
import { CheckCircle2, MapPinned, Save, Store } from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  fieldLabels,
  getMissingSanggarFields,
  getStoredSanggarDraft,
  isSanggarComplete,
  saveSanggarDraft,
  type SanggarDraft,
} from "./sanggarDraft";

const regions = [
  { id: "1", name: "Tegal Barat" },
  { id: "2", name: "Tegal Timur" },
  { id: "3", name: "Tegal Selatan" },
  { id: "4", name: "Margadana" },
  { id: "5", name: "Slawi" },
];

const AdminSanggarSettings = () => {
  const [draft, setDraft] = useState<SanggarDraft>(() => getStoredSanggarDraft());
  const [saved, setSaved] = useState(false);
  const missingFields = useMemo(() => getMissingSanggarFields(draft), [draft]);
  const complete = isSanggarComplete(draft);

  const handleChange = (field: keyof SanggarDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSanggarDraft(draft);
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

          <Field label="Nama Sanggar" value={draft.name} onChange={(value) => handleChange("name", value)} />
          <Field label="Nama Pemilik" value={draft.ownerName} onChange={(value) => handleChange("ownerName", value)} />
          <Field label="Nomor HP" value={draft.phone} onChange={(value) => handleChange("phone", value)} />
          <Field label="Latitude" value={draft.latitude} onChange={(value) => handleChange("latitude", value)} />
          <Field label="Longitude" value={draft.longitude} onChange={(value) => handleChange("longitude", value)} />
          <Field label="URL Gambar" value={draft.image} onChange={(value) => handleChange("image", value)} />
        </div>

        <label className="mt-5 block space-y-2">
          <span className="text-[17px] font-bold text-[#444444]">Alamat Lengkap</span>
          <textarea
            value={draft.address}
            onChange={(event) => handleChange("address", event.target.value)}
            rows={3}
            className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
          />
        </label>

        <label className="mt-5 block space-y-2">
          <span className="text-[17px] font-bold text-[#444444]">Deskripsi</span>
          <textarea
            value={draft.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={4}
            className="w-full resize-none rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 py-4 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
          />
        </label>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[#777777]">
            {complete
              ? "Data wajib sudah lengkap."
              : `Belum lengkap: ${missingFields.map((field) => fieldLabels[field]).join(", ")}`}
          </p>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#ff9800] px-7 text-white hover:bg-[#e48600]"
          >
            <Save size={17} />
            Simpan Setelan
          </Button>
        </div>

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
            dan longitude terisi.
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
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="space-y-2">
    <span className="text-[17px] font-bold text-[#444444]">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[58px] w-full rounded-[22px] border border-[#bfc0c5] bg-[#f7f8fd] px-6 text-[17px] outline-none focus:ring-2 focus:ring-[#b6ec00]"
    />
  </label>
);

export default AdminSanggarSettings;
