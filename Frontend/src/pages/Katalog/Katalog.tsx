import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Star, MapPin, ChevronDown } from 'lucide-react';
import { productApi, weightHistoryApi, recommendationApi } from '../../services/api';

// Bentuk data persis seperti yang dibalikin getAllProducts di backend
// (include: { sanggar: true, category: true, reviews: true })
type BackendProduct = {
  id: number;
  sanggarId: number;
  categoryId: number;
  productName: string;
  price: number | string;
  image: string | null;
  sanggar?: { id: number; name: string; address: string; region?: { name: string } } | null;
  category?: { id: number; categoryName: string } | null;
  reviews: { quality: number; popularity: number; design: number }[];
};

// Bentuk data hasil TOPSIS join sanggar dari getTopsisResultsWithSanggar
type TopsisResult = {
  ranking: number;
  productId: number;
  productName: string;
  price: number | string;
  image: string | null;
  nilai_preferensi: number | string;
  jarak: number | string;
  sanggarName: string;
  sanggarId: number;
};

// Bentuk tampilan seragam dipakai di dalam kartu, dari mana pun asalnya
// (data awal hasil filter wilayah/jenis, atau hasil ranking TOPSIS)
type ProdukTampil = {
  id: string;
  nama: string;
  namaSanggar: string;
  harga: number;
  foto: string[];
  rating: number;
  jumlahReview: number;
  wilayah: string;
  kategori: string;
  skorTopsis?: number; // hanya terisi setelah SPK dijalankan
  jarak?: number;
};

const RENTANG_HARGA = [
  { label: 'Rp 0 - Rp 50.000', min: 0, max: 50000 },
  { label: 'Rp 50.000 - Rp 100.000', min: 50000, max: 100000 },
  { label: 'Rp 100.000 - Rp 150.000', min: 100000, max: 150000 },
  { label: 'Rp 150.000 - Rp 200.000', min: 150000, max: 200000 },
];

// 5 kriteria TOPSIS sesuai kolom di weight_histories.
// TOPSIS bekerja di level kriteria tunggal (tidak ada subkriteria);
// kualitas/popularitas/desain masing-masing sudah jadi kriteria sendiri,
// sesuai kesepakatan bersama dosen.
const KRITERIA_OPTIONS = [
  { value: '', label: '-' },
  { value: 'popularitas', label: 'Popularitas tertinggi' },
  { value: 'kualitas', label: 'Kualitas terbaik' },
  { value: 'desain', label: 'Desain terbaik' },
  { value: 'jarak', label: 'Jarak terdekat' },
];

const KRITERIA_HARGA_OPTIONS = [
  { value: '', label: '-' },
  { value: 'harga-murah', label: 'Harga termurah' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const mapBackendProductToTampil = (p: BackendProduct): ProdukTampil => {
  const jumlahReview = p.reviews.length;
  const rating =
    jumlahReview > 0
      ? p.reviews.reduce((sum, r) => sum + (r.quality + r.popularity + r.design) / 3, 0) / jumlahReview
      : 0;

  return {
    id: String(p.id),
    nama: p.productName,
    namaSanggar: p.sanggar?.name || '',
    harga: Number(p.price),
    foto: [p.image || '/batik 1.jpg'],
    rating: Number(rating.toFixed(1)),
    jumlahReview,
    wilayah: p.sanggar?.region?.name || '',
    kategori: p.category?.categoryName || '',
  };
};

const mapTopsisToTampil = (r: TopsisResult): ProdukTampil => ({
  id: String(r.productId),
  nama: r.productName,
  namaSanggar: r.sanggarName,
  harga: Number(r.price),
  foto: [r.image || '/batik 1.jpg'],
  rating: 0,
  jumlahReview: 0,
  wilayah: '',
  kategori: '',
  skorTopsis: Number(r.nilai_preferensi),
  jarak: Number(r.jarak),
});

const Katalog = () => {
  const [searchParams] = useSearchParams();

  // regionId & categoryId ini KLASIFIKASI awal, dibawa dari landing page (Home)
  const regionId = searchParams.get('regionId') || '';
  const categoryId = searchParams.get('categoryId') || '';

  // Dua dropdown "Urutkan Berdasarkan" ini yang jadi PENENTU BOBOT SPK
  // (bukan sekadar sort/filter lagi). Kriteria yang dipilih akan diberi
  // bobot 5, kriteria lain otomatis bobot 1 — dibuat di backend lewat
  // /api/weight-histories, lalu dipakai TOPSIS buat menghitung ranking
  // beneran, bukan hanya menyaring data yang sudah ada.
  const [sortBy, setSortBy] = useState('');
  const [sortHarga, setSortHarga] = useState('');

  // Rentang harga di sidebar tetap KLASIFIKASI (filter), bukan bagian SPK
  const [selectedHarga, setSelectedHarga] = useState<number[]>([]);

  const [produkList, setProdukList] = useState<ProdukTampil[]>([]);
  const [isLoadingAwal, setIsLoadingAwal] = useState(true);
  const [isRunningSpk, setIsRunningSpk] = useState(false);
  const [sudahSpk, setSudahSpk] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [userLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  const judulKategori = 'Semua Produk';

  // Hitung rentang harga gabungan dari checkbox yang dicentang, buat query minPrice/maxPrice
  const getRentangHargaTerpilih = () => {
    if (selectedHarga.length === 0) return { minPrice: undefined, maxPrice: undefined };
    const ranges = selectedHarga.map((idx) => RENTANG_HARGA[idx]);
    return {
      minPrice: Math.min(...ranges.map((r) => r.min)),
      maxPrice: Math.max(...ranges.map((r) => r.max)),
    };
  };

  // Ambil data AWAL: produk hasil filter wilayah + jenis batik dari landing page
  // (dan rentang harga kalau ada dicentang). Ini murni klasifikasi, belum SPK.
  const fetchDataAwal = async () => {
    setIsLoadingAwal(true);
    setErrorMsg('');
    setSudahSpk(false);
    try {
      const { minPrice, maxPrice } = getRentangHargaTerpilih();
      const res = await productApi.getAll({
        regionId: regionId ? Number(regionId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        minPrice,
        maxPrice,
      });
      const data = res.data.data as BackendProduct[];
      setProdukList(data.map(mapBackendProductToTampil));
    } catch (err: any) {
      setErrorMsg('Gagal memuat produk. Coba muat ulang halaman.');
    } finally {
      setIsLoadingAwal(false);
    }
  };

  useEffect(() => {
    fetchDataAwal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId, categoryId]);

  const resetFilter = () => {
    setSelectedHarga([]);
    setSortBy('');
    setSortHarga('');
    fetchDataAwal();
  };

  const toggleHarga = (idx: number) => {
    setSelectedHarga((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Tombol "Cari": kalau tidak ada kriteria SPK dipilih, cuma re-filter data awal
  // (rentang harga). Kalau ada kriteria dipilih (sortBy/sortHarga), jalankan
  // TOPSIS dan ganti list yang tampil dengan hasil ranking + skor preferensi —
  // ini bagian yang bikin fiturnya jadi SPK, bukan filter.
  const handleCari = async () => {
    const kriteriaUtama = sortHarga === 'harga-murah' ? 'harga' : sortBy;

    if (!kriteriaUtama) {
      // Tidak ada kriteria SPK dipilih -> cuma klasifikasi ulang (rentang harga)
      await fetchDataAwal();
      return;
    }

    if (!userLocation) {
      setErrorMsg('Lokasi belum tersedia. Aktifkan izin lokasi di browser lalu muat ulang halaman.');
      return;
    }

    setErrorMsg('');
    setIsRunningSpk(true);
    try {
      // Kriteria kedua: kalau harga sudah jadi kriteria utama, kriteria kedua
      // diambil dari sortBy (asal beda), begitu juga sebaliknya.
      let kriteriaKedua: string | null = null;
      if (kriteriaUtama === 'harga' && sortBy) {
        kriteriaKedua = sortBy;
      } else if (kriteriaUtama !== 'harga' && sortHarga === 'harga-murah') {
        kriteriaKedua = 'harga';
      }
      if (kriteriaKedua === kriteriaUtama) kriteriaKedua = null;

      // 1. Buat bobot SPK dari kriteria yang dipilih user (bobot 5 vs bobot 1)
      const weightRes = await weightHistoryApi.create({ kriteriaUtama, kriteriaKedua });
      const weightHistoryId = weightRes.data.data.id;

      // 2. Jalankan TOPSIS: bikin spk_session + ambil hasil dari v_topsis_hasil
      const { minPrice, maxPrice } = getRentangHargaTerpilih();
      const sessionId = `spk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const runRes = await recommendationApi.run({
        sessionId,
        regionId: regionId ? Number(regionId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        minPrice,
        maxPrice,
        userLat: userLocation.lat,
        userLon: userLocation.lng,
        weightHistoryId,
      });

      const results = runRes.data.data.results as TopsisResult[];
      setProdukList(results.map(mapTopsisToTampil));
      setSudahSpk(true);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Gagal menjalankan rekomendasi SPK. Coba lagi.');
    } finally {
      setIsRunningSpk(false);
    }
  };

  const handleEksplor = () => {
    window.open('https://www.google.com/maps/search/batik+tegal/@-6.8694,109.1402,14z', '_blank');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-4">
            {/* Peta */}
            <div
              onClick={handleEksplor}
              className="rounded-2xl overflow-hidden bg-gray-300 h-44 relative cursor-pointer group"
            >
              <iframe
                title="peta-tegal"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15811.234!2d109.1402!3d-6.8694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1234567890"
                className="w-full h-full opacity-80 pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                <button className="bg-lime-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-lime-600 transition">
                  Eksplor di Peta
                </button>
              </div>
            </div>

            {/* Filter Harga (klasifikasi, bukan SPK) */}
            <div className="bg-white rounded-2xl p-5 border border-cream-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-brown-900">Rentang Harga</h3>
                <button onClick={resetFilter} className="text-lime-600 text-sm font-medium hover:text-lime-700">
                  Reset
                </button>
              </div>
              <div className="space-y-3">
                {RENTANG_HARGA.map((range, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedHarga.includes(idx)}
                      onChange={() => toggleHarga(idx)}
                      className="w-4 h-4 accent-lime-500 rounded"
                    />
                    <span className="text-sm text-brown-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-serif font-bold text-brown-900">{judulKategori}</h1>
                <p className="text-brown-500 text-sm mt-0.5">
                  {produkList.length} Produk ditemukan
                  {sudahSpk && <span className="text-lime-600 font-medium"> — diurutkan pakai TOPSIS</span>}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-brown-600 whitespace-nowrap">Urutkan Berdasarkan:</span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-cream-50 border border-lime-400 text-lime-700 text-sm rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
                  >
                    {KRITERIA_OPTIONS.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-lime-600 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortHarga}
                    onChange={(e) => setSortHarga(e.target.value)}
                    className="appearance-none bg-cream-50 border border-lime-400 text-lime-700 text-sm rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
                  >
                    {KRITERIA_HARGA_OPTIONS.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-lime-600 pointer-events-none" />
                </div>

                <button
                  onClick={handleCari}
                  disabled={isRunningSpk}
                  className="bg-lime-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-lime-600 transition flex items-center gap-1 disabled:opacity-60"
                >
                  <Search size={14} />
                  {isRunningSpk ? 'Menghitung...' : 'Cari'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              {isLoadingAwal ? (
                <div className="text-center py-20 text-brown-500">Memuat produk...</div>
              ) : produkList.length === 0 ? (
                <div className="text-center py-20 text-brown-500">
                  Tidak ada produk yang sesuai filter
                </div>
              ) : (
                produkList.map((produk) => (
                  <Link
                    key={produk.id}
                    to={`/produk/${produk.id}`}
                    className="block bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-56 flex-shrink-0">
                        <div className="h-40 bg-gray-100 relative">
                          <img src={produk.foto[0]} alt={produk.nama} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow"
                          >
                            <Star size={14} className="text-gray-400" />
                          </button>
                          {produk.skorTopsis !== undefined && (
                            <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                              Skor {produk.skorTopsis.toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 p-4 flex">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-4 h-4 bg-brown-800 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs leading-none">✦</span>
                            </div>
                            <span className="text-brown-900 font-bold text-base truncate">{produk.nama}</span>
                          </div>
                          <div className="text-lime-600 text-sm font-medium mb-1.5 ml-5">{produk.namaSanggar}</div>
                          {produk.rating > 0 && (
                            <div className="flex items-center gap-0.5 mb-2 ml-5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13} className={i < produk.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                          )}
                          {produk.wilayah && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                              <MapPin size={13} className="text-red-400 flex-shrink-0" />
                              <span>{produk.wilayah}</span>
                            </div>
                          )}
                          {produk.jarak !== undefined && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                              <MapPin size={13} className="text-red-400 flex-shrink-0" />
                              <span>{produk.jarak.toFixed(1)} km dari lokasimu</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right flex flex-col justify-between ml-4 flex-shrink-0 w-36">
                          <div>
                            {produk.jumlahReview > 0 && (
                              <div className="text-gray-400 text-xs">({produk.jumlahReview}+ ulasan)</div>
                            )}
                          </div>
                          <div>
                            <div className="text-orange-500 font-bold text-lg leading-tight">{formatPrice(produk.harga)}</div>
                            <button
                              onClick={(e) => e.preventDefault()}
                              className="mt-2 bg-lime-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-lime-600 transition w-full"
                            >
                              Pilih Warna
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Katalog;