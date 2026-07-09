import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, ChevronLeft, Star } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { MapComponent } from '../../components/Map/MapComponent';
import { BatikPattern } from '../../assets/BatikPattern';
import { sanggarApi } from '../../services/api';

// Bentuk data persis seperti yang dibalikin getSanggarById di backend
// (include: { region: true, products: { include: { category: true, reviews: true } } })
type BackendReview = { quality: number; popularity: number; design: number };

type BackendProduct = {
  id: number;
  productName: string;
  price: number | string;
  image: string | null;
  category?: { id: number; categoryName: string } | null;
  reviews: BackendReview[];
};

type BackendSanggar = {
  id: number;
  name: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
  phone: string | null;
  description: string | null;
  image: string | null;
  region?: { id: number; name: string } | null;
  products: BackendProduct[];
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

// Hitung rating rata-rata dari kumpulan review (quality, popularity, design)
const hitungRating = (reviews: BackendReview[]) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce(
    (sum, r) => sum + (r.quality + r.popularity + r.design) / 3,
    0
  );
  return Number((total / reviews.length).toFixed(1));
};

// Card produk (dari data backend)
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

const SanggarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: sanggar,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sanggar', id],
    queryFn: async () => {
      const res = await sanggarApi.getById(id!);
      return res.data.data as BackendSanggar;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5ead8]">
        <div className="text-brown-700">Memuat data sanggar...</div>
      </div>
    );
  }

  if (isError || !sanggar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5ead8]">
        <div className="text-2xl font-serif text-brown-900">Sanggar tidak ditemukan</div>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  // Rating sanggar = rata-rata review dari SEMUA produk milik sanggar ini
  const semuaReview = sanggar.products.flatMap((p) => p.reviews);
  const ratingSanggar = hitungRating(semuaReview);

  return (
    <div className="relative min-h-screen bg-[#f5ead8]">
      {/* Background Pattern — samain kaya landing page */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        <BatikPattern className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-brown-700">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-brown-900 transition-colors"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>
        </div>

        {/* Sanggar Header */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 mb-10 shadow-[0_16px_40px_rgba(88,56,34,0.08)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={sanggar.image || '/batik 1.jpg'}
                alt={sanggar.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
                {sanggar.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(ratingSanggar)
                        ? 'fill-[#eab308] text-[#eab308]'
                        : 'fill-gray-200 text-gray-200'
                    }
                  />
                ))}
                <span className="text-brown-700 text-sm">
                  {ratingSanggar.toFixed(1)} ({semuaReview.length} ulasan)
                </span>
              </div>

              {sanggar.description && (
                <p className="text-brown-700 mb-5 leading-relaxed">{sanggar.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-[#b08d28] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-brown-800">Alamat</h3>
                    <p className="text-sm text-brown-700">
                      {sanggar.address}
                      {sanggar.region ? `, ${sanggar.region.name}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={18} className="text-[#b08d28] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-brown-800">Kontak</h3>
                    <p className="text-sm text-brown-700">{sanggar.phone || '-'}</p>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full md:w-auto"
                onClick={() => {
                  if (sanggar.phone) {
                    window.open(`https://wa.me/${sanggar.phone.replace(/\D/g, '')}`, '_blank');
                  }
                }}
              >
                Hubungi Sanggar
              </Button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-brown-900 mb-6">
            Produk Sanggar
          </h2>

          {sanggar.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sanggar.products.map((produk) => (
                <ProductCard key={produk.id} produk={produk} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brown-600 bg-white/50 rounded-xl">
              Sanggar ini belum memiliki produk
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-brown-900 mb-4">
            Lokasi Sanggar
          </h2>
          <Card>
            <MapComponent
              latitude={Number(sanggar.latitude)}
              longitude={Number(sanggar.longitude)}
              nama={sanggar.name}
              alamat={sanggar.address}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SanggarDetail;