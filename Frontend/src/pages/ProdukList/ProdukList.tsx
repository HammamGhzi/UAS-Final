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
    <Link to={`/produk/${produk.id}`} className="block h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_4px_18px_rgba(67,47,39,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(67,47,39,0.16)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-brown-100">
          <img
            src={produk.image || '/batik 1.jpg'}
            alt={produk.productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {produk.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#432f27] shadow-sm backdrop-blur-sm">
              {produk.category.categoryName}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-serif text-base font-bold leading-snug text-brown-900 line-clamp-1">
            {produk.productName}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-[#fdf3e0] px-2 py-0.5">
              <Star size={12} className="fill-[#b08d28] text-[#b08d28]" />
              <span className="text-xs font-semibold text-[#8a6c1f]">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-brown-500">
              ({produk.reviews.length} ulasan)
            </span>
          </div>

          <p className="mt-auto pt-1 text-lg font-extrabold text-[#432f27]">
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