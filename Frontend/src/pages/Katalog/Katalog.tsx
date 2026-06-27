import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Star, MapPin, ChevronDown } from 'lucide-react';

const DUMMY_PRODUK = [
  {
    id: '1', nama: 'Batik Aing Maung', kategori: 'Flora', harga: 110123, hargaAsli: 128672,
    foto: ['/batik1.jpg', '/batik2.jpg', '/batik3.jpg'], rating: 4, jumlahReview: 100,
    wilayah: 'Tegal Selatan', kota: 'Kota Tegal', tags: ['Modern', 'Terpopuler di Kota Tegal'],
    score: 8.7, label: 'Mengesankan', namaSanggar: 'Batik Tegalan Maudy',
    lat: -6.8694, lng: 109.1402,
  },
  {
    id: '2', nama: 'Batik Curug Klawi', kategori: 'Flora', harga: 110123, hargaAsli: 128672,
    foto: ['/batik1.jpg', '/batik2.jpg', '/batik3.jpg'], rating: 4, jumlahReview: 100,
    wilayah: 'Tegal Selatan', kota: 'Kota Tegal', tags: ['Modern', 'Terpopuler di Kota Tegal'],
    score: 8.7, label: 'Mengesankan', namaSanggar: 'Batik Srikandi Tegal',
    lat: -6.8700, lng: 109.1410,
  },
  {
    id: '3', nama: 'Batik Mega Mendung', kategori: 'Flora', harga: 95000, hargaAsli: 120000,
    foto: ['/batik1.jpg', '/batik2.jpg', '/batik3.jpg'], rating: 5, jumlahReview: 200,
    wilayah: 'Tegal Barat', kota: 'Kota Tegal', tags: ['Klasik'],
    score: 9.1, label: 'Luar Biasa', namaSanggar: 'Sanggar Batik Nusantara',
    lat: -6.8650, lng: 109.1350,
  },
  {
    id: '4', nama: 'Batik Parang Kusuma', kategori: 'Geometris', harga: 145000, hargaAsli: 160000,
    foto: ['/batik1.jpg', '/batik2.jpg', '/batik3.jpg'], rating: 4, jumlahReview: 75,
    wilayah: 'Margadana', kota: 'Kota Tegal', tags: ['Premium'],
    score: 8.2, label: 'Sangat Baik', namaSanggar: 'Batik Tegalan Maudy',
    lat: -6.8720, lng: 109.1380,
  },
];

const RENTANG_HARGA = [
  { label: 'Rp 0 - Rp 50.000', min: 0, max: 50000 },
  { label: 'Rp 50.000 - Rp 100.000', min: 50000, max: 100000 },
  { label: 'Rp 100.000 - Rp 150.000', min: 100000, max: 150000 },
  { label: 'Rp 150.000 - Rp 200.000', min: 150000, max: 200000 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const Katalog = () => {
  const [searchParams] = useSearchParams();
  const wilayahParam = searchParams.get('wilayah') || '';
  const jenisParam = searchParams.get('jenis') || '';

  const [sortBy, setSortBy] = useState('-');
  const [sortHarga, setSortHarga] = useState('-');
  const [selectedHarga, setSelectedHarga] = useState<number[]>([]);

  const [activeSortBy, setActiveSortBy] = useState('-');
  const [activeSortHarga, setActiveSortHarga] = useState('-');
  const [activeSelectedHarga, setActiveSelectedHarga] = useState<number[]>([]);

  const [userLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  const judulKategori = jenisParam
    ? jenisParam.charAt(0).toUpperCase() + jenisParam.slice(1)
    : 'Semua Produk';

  const toggleHarga = (idx: number) => {
    setSelectedHarga((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const resetFilter = () => {
    setSelectedHarga([]);
    setSortBy('-');
    setSortHarga('-');
    setActiveSortBy('-');
    setActiveSortHarga('-');
    setActiveSelectedHarga([]);
  };

  const handleCari = () => {
    setActiveSortBy(sortBy);
    setActiveSortHarga(sortHarga);
    setActiveSelectedHarga(selectedHarga);

    // Nanti dikirim ke backend TOPSIS
    console.log('Payload ke backend:', {
      sortBy,
      sortHarga,
      rentangHarga: selectedHarga.map((idx) => RENTANG_HARGA[idx]),
      userLat: userLocation?.lat,
      userLng: userLocation?.lng,
    });
  };

  const handleEksplor = () => {
    window.open('https://www.google.com/maps/search/batik+tegal/@-6.8694,109.1402,14z', '_blank');
  };

  const filteredProduk = DUMMY_PRODUK.filter((p) => {
    const matchKategori = !jenisParam || p.kategori.toLowerCase() === jenisParam.toLowerCase();
    const matchWilayah = !wilayahParam || p.wilayah.toLowerCase().replace(/ /g, '-') === wilayahParam;
    const matchHarga =
      activeSelectedHarga.length === 0 ||
      activeSelectedHarga.some((idx) => p.harga >= RENTANG_HARGA[idx].min && p.harga <= RENTANG_HARGA[idx].max);
    return matchKategori && matchWilayah && matchHarga;
  });

  const sorted = [...filteredProduk].sort((a, b) => {
    if (activeSortHarga === 'harga-murah') return a.harga - b.harga;
    if (activeSortHarga === 'harga-mahal') return b.harga - a.harga;
    if (activeSortBy === 'rating') return b.rating - a.rating;
    if (activeSortBy === 'popularitas') return b.score - a.score;
    return b.score - a.score;
  });

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

            {/* Filter Harga */}
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
                <p className="text-brown-500 text-sm mt-0.5">{sorted.length} Produk ditemukan</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-brown-600 whitespace-nowrap">Urutkan Berdasarkan:</span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-cream-50 border border-lime-400 text-lime-700 text-sm rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
                  >
                    <option value="-">-</option>
                    <option value="popularitas">Popularitas tertinggi</option>
                    <option value="rating">Rating tertinggi</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-lime-600 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortHarga}
                    onChange={(e) => setSortHarga(e.target.value)}
                    className="appearance-none bg-cream-50 border border-lime-400 text-lime-700 text-sm rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
                  >
                    <option value="-">-</option>
                    <option value="harga-murah">Harga termurah</option>
                    <option value="harga-mahal">Harga termahal</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-lime-600 pointer-events-none" />
                </div>

                <button
                  onClick={handleCari}
                  className="bg-lime-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-lime-600 transition flex items-center gap-1"
                >
                  <Search size={14} />
                  Cari
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sorted.length === 0 ? (
                <div className="text-center py-20 text-brown-500">
                  Tidak ada produk yang sesuai filter
                </div>
              ) : (
                sorted.map((produk) => (
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
                        </div>
                        <div className="flex h-14">
                          {produk.foto.slice(0, 2).map((f, i) => (
                            <div key={i} className="flex-1 bg-gray-100 overflow-hidden border-r border-white">
                              <img src={f} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="flex-1 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                            <img src={produk.foto[2]} alt="" className="w-full h-full object-cover opacity-50" />
                            <span className="absolute text-white text-xs font-semibold drop-shadow">Lihat Foto</span>
                          </div>
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
                          <div className="flex items-center gap-0.5 mb-2 ml-5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} className={i < produk.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                            <MapPin size={13} className="text-red-400 flex-shrink-0" />
                            <span>{produk.wilayah}, {produk.kota}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {produk.tags.map((tag) => (
                              <span key={tag} className="bg-cream-100 text-brown-600 text-xs px-2.5 py-1 rounded-full border border-cream-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right flex flex-col justify-between ml-4 flex-shrink-0 w-36">
                          <div>
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-lime-600 font-bold text-lg leading-tight">{produk.score}/10</span>
                              <span className="text-lime-600 text-xs font-semibold">{produk.label}</span>
                            </div>
                            <div className="text-gray-400 text-xs">({produk.jumlahReview}+ ulasan)</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm line-through">{formatPrice(produk.hargaAsli)}</div>
                            <div className="text-orange-500 font-bold text-lg leading-tight">{formatPrice(produk.harga)}</div>
                            <div className="text-gray-500 text-xs">Total {formatPrice(Math.round(produk.harga * 1.1))}</div>
                            <div className="text-gray-500 text-xs">untuk 1 bahan</div>
                            <div className="text-gray-400 text-xs mb-2">Termasuk pajak & biaya</div>
                            <button
                              onClick={(e) => e.preventDefault()}
                              className="bg-lime-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-lime-600 transition w-full"
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