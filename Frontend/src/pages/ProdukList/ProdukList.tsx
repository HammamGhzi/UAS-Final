import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { ProductCardHome } from '../../components/Product/ProductCardHome';
import { DUMMY_PRODUCTS, KATEGORI_LIST } from '../../data/dummyProducts';

const ProdukList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');

  const filteredProduk = useMemo(() => {
    return DUMMY_PRODUCTS.filter((produk) => {
      const matchKategori = !kategori || produk.kategori === kategori;
      const matchSearch =
        !search ||
        produk.nama.toLowerCase().includes(search.toLowerCase()) ||
        produk.motif.toLowerCase().includes(search.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [search, kategori]);

  return (
    <div className="min-h-screen bg-[#f5ead8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brown-900 mb-2">
            Semua Produk Batik
          </h1>
          <p className="text-brown-600 text-sm">
            Jelajahi seluruh koleksi batik Tegalan dari sanggar-sanggar pilihan
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk atau motif..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brown-300 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-[#b08d28]/40 focus:border-[#b08d28]/60 transition"
            />
          </div>

          <div className="relative sm:w-56">
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full appearance-none pl-4 pr-9 py-3 rounded-2xl border border-brown-300 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-[#b08d28]/40 focus:border-[#b08d28]/60 transition text-brown-800"
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_LIST.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Info jumlah */}
        <p className="text-sm text-brown-600 mb-6 text-center sm:text-left">
          {filteredProduk.length} produk ditemukan
        </p>

        {/* Grid Produk */}
        {filteredProduk.length === 0 ? (
          <div className="text-center py-20 text-brown-500">
            Tidak ada produk yang cocok dengan pencarian kamu
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProduk.map((produk) => (
              <ProductCardHome key={produk.id} produk={produk} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-brown-800 hover:text-brown-900 transition-colors underline"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProdukList;