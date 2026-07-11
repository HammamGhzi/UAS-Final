import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, MapPin, Search, Wallet } from 'lucide-react';

const hargaOptions = [
  { value: 'termurah', label: 'Termurah', description: 'Rp 0 - Rp 100.000.', minPrice: '0', maxPrice: '100000' },
  { value: 'sedang', label: 'Sedang', description: 'Rp 100.000 - Rp 150.000.', minPrice: '100000', maxPrice: '150000' },
  { value: 'eksklusif', label: 'Eksklusif', description: 'Lebih dari Rp 150.000.', minPrice: '150000', maxPrice: '' },
];

const lokasiOptions = [
  { value: 'terdekat', label: 'Terdekat', description: '0 - 3 km dari lokasi user.', minKm: '0', maxKm: '3' },
  { value: 'sedang', label: 'Sedang', description: '3 - 8 km dari lokasi user.', minKm: '3', maxKm: '8' },
  { value: 'terjauh', label: 'Terjauh', description: 'Lebih dari 8 km dari lokasi user.', minKm: '8', maxKm: '' },
];

const priorityOptions = [
  { value: 'harga', label: 'Harga' },
  { value: 'lokasi', label: 'Lokasi' },
  { value: 'keduanya', label: 'Keduanya' },
];

const SpkPreference = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wilayah = searchParams.get('wilayah') || '';
  const jenis = searchParams.get('jenis') || '';
  const [harga, setHarga] = useState('sedang');
  const [lokasi, setLokasi] = useState('terdekat');
  const [prioritas, setPrioritas] = useState('keduanya');

  const summary = useMemo(() => {
    const wilayahText = wilayah ? wilayah.replace(/-/g, ' ') : 'Semua wilayah';
    const jenisText = jenis || 'Semua jenis';
    return { wilayahText, jenisText };
  }, [wilayah, jenis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedHarga = hargaOptions.find((option) => option.value === harga) || hargaOptions[1];
    const selectedLokasi = lokasiOptions.find((option) => option.value === lokasi) || lokasiOptions[0];

    // Catatan: halaman ini hanya menambahkan tahap preferensi SPK sebelum hasil katalog.
    // Logic katalog lama tetap membaca `wilayah` dan `jenis`; parameter SPK baru disiapkan
    // agar mudah disambungkan ke perhitungan backend kalau nanti dibutuhkan.
    const params = new URLSearchParams({
      wilayah,
      jenis,
      harga,
      minPrice: selectedHarga.minPrice,
      maxPrice: selectedHarga.maxPrice,
      lokasi,
      minKm: selectedLokasi.minKm,
      maxKm: selectedLokasi.maxKm,
      prioritas,
    });

    navigate(`/katalog?${params.toString()}`);
  };

  const optionClass = (active: boolean) =>
    `rounded-2xl border p-4 text-left transition ${
      active
        ? 'border-[#788a4a] bg-[#f3f6eb] shadow-sm'
        : 'border-cream-300 bg-white hover:border-[#aab878]'
    }`;

  return (
    <div className="min-h-screen bg-[#f5ead8] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brown-800 hover:text-black"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="mb-6 rounded-3xl border border-white/60 bg-white/50 p-5 shadow-sm backdrop-blur">
          <h1 className="font-serif text-3xl font-bold text-brown-900">Atur Preferensi Pencarian</h1>
          <p className="mt-2 text-sm text-brown-700">
              Lengkapi preferensi ini sebelum hasil katalog ditampilkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-cream-300 bg-white p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6eb] text-[#64743d]">
                  <Wallet size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-brown-900">Range Harga</h2>
                  <p className="text-sm text-brown-600">Pilih kategori budget yang paling cocok.</p>
                </div>
              </div>

              <div className="grid gap-3">
                {hargaOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setHarga(option.value)}
                    className={optionClass(harga === option.value)}
                  >
                    <span className="block font-bold text-brown-900">{option.label}</span>
                    <span className="mt-1 block text-sm text-brown-600">{option.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6eb] text-[#64743d]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-brown-900">Jarak Lokasi</h2>
                  <p className="text-sm text-brown-600">Tentukan toleransi jarak sanggar.</p>
                </div>
              </div>

              <div className="grid gap-3">
                {lokasiOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLokasi(option.value)}
                    className={optionClass(lokasi === option.value)}
                  >
                    <span className="block font-bold text-brown-900">{option.label}</span>
                    <span className="mt-1 block text-sm text-brown-600">{option.description}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 border-t border-cream-200 pt-6">
            <h2 className="mb-3 font-bold text-brown-900">Prioritas Pencarian</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrioritas(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    prioritas === option.value
                      ? 'border-[#788a4a] bg-[#788a4a] text-white'
                      : 'border-cream-300 text-brown-800 hover:border-[#aab878]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/katalog?wilayah=${wilayah}&jenis=${jenis}`)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#788a4a] px-6 py-3 text-sm font-semibold text-[#64743d] transition hover:bg-[#f3f6eb]"
            >
              Lewati
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#788a4a] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#68793f]"
            >
              <Search size={18} />
              Lihat Hasil
              <ChevronRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpkPreference;
