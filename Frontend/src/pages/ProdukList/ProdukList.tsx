import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, Star } from 'lucide-react';
import { productApi, batikCategoryApi } from '../../services/api';

// Bentuk data persis seperti yang dibalikin getAllProducts di backend
// (include: { sanggar: true, category: true, reviews: true })
type BackendReview = { quality: number; popularity: number; design: number };

type BackendProduct = {
  id: number;
  productName: string;
  price: number | string;
  image: string | null;
  category?: { id: number; categoryName: string } | null;
  sanggar?: { id: number; name: string } | null;
  reviews: BackendReview[];
};

type BackendCategory = { id: number; categoryName: string };

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const hitungRating = (reviews: BackendReview[]) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce(
    (sum, r) => sum + (r.quality + r.popularity + r.design) / 3,
    0
  );
  return total / reviews.length;
};

const ProductCard = ({ produk }: { produk: BackendProduct }) => {
  const rating = hitungRating(produk.reviews);
  return (
    <Link to={`/produk/${produk.id}`}>
      <div className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-brown-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="h-32 sm:h-36 overflow-hidden bg-brown-100 relative">
          <img
            src={produk.image || '/batik 1.jpg'}
            alt={produk.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {produk.category && (
            <span className="absolute top-2 left-2 bg-[#432f27]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {produk.category.categoryName}
            </span>
          )}
        </div>
        <div className="p-2.5 flex flex-col flex-1">
          <h3 className="font-serif font-bold text-brown-900 text-sm mb-1 line-clamp-1">
            {produk.productName}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="fill-[#b08d28] text-[#b08d28]" />
            <span className="text-xs text-brown-700">{rating.toFixed(1)}</span>
            <span className="text-[11px] text-brown-500">({produk.reviews.length})</span>
          </div>
          <p className="text-[#b08d28] font-bold text-sm mt-auto">
            {formatPrice(Number(produk.price))}
          </p>
        </div>
      </div>
    </Link>
  );
};

const ProdukList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [kategoriId, setKategoriId] = useState('');

const { data: produkList = [], isLoading } = useQuery({
    queryKey: ['produk-list'],
    queryFn: async () => {
      const res = await productApi.getAll();
      return res.data.data as BackendProduct[];
    },
  });

  const { data: kategoriList = [] } = useQuery({
    queryKey: ['batik-categories'],
    queryFn: async () => {
      const res = await batikCategoryApi.getAll();
      return res.data.data as BackendCategory[];
    },
  });

  const filteredProduk = useMemo(() => {
    return produkList.filter((produk) => {
      const matchKategori = !kategoriId || produk.category?.id === Number(kategoriId);
      const matchSearch =
        !search || produk.productName.toLowerCase().includes(search.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [produkList, search, kategoriId]);

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
              placeholder="Cari nama produk..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brown-300 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-[#b08d28]/40 focus:border-[#b08d28]/60 transition"
            />
          </div>

          <div className="relative sm:w-56">
            <select
              value={kategoriId}
              onChange={(e) => setKategoriId(e.target.value)}
              className="w-full appearance-none pl-4 pr-9 py-3 rounded-2xl border border-brown-300 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-[#b08d28]/40 focus:border-[#b08d28]/60 transition text-brown-800"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.categoryName}
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
          {isLoading ? 'Memuat produk...' : `${filteredProduk.length} produk ditemukan`}
        </p>

        {/* Grid Produk */}
        {!isLoading && filteredProduk.length === 0 ? (
          <div className="text-center py-20 text-brown-500">
            Tidak ada produk yang cocok dengan pencarian kamu
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProduk.map((produk) => (
              <ProductCard key={produk.id} produk={produk} />
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