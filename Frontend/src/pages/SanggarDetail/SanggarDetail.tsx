import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, ChevronLeft, Star } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { MapComponent } from '../../components/Map/MapComponent';
import { BatikPattern } from '../../assets/BatikPattern';
import { sanggarApi } from '../../services/api';

// Bentuk data persis seperti yang dibalikin getSanggarById di backend
// (include: { region: true, products: { include: { category: true, reviews: true } } })
type BackendReview = {
  id: number;
  reviewerName: string;
  quality: number;
  popularity: number;
  design: number;
  comment: string | null;
  createdAt: string;
};

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

const formatTanggal = (isoString: string) =>
  new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// Hitung rating rata-rata dari kumpulan review (quality, popularity, design)
const hitungRating = (reviews: BackendReview[]) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce(
    (sum, r) => sum + (r.quality + r.popularity + r.design) / 3,
    0
  );
  return Number((total / reviews.length).toFixed(1));
};

// Avatar bulat dari inisial nama reviewer
const Avatar = ({ name }: { name: string }) => {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#432f27] text-sm font-semibold text-white">
      {initial}
    </div>
  );
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

// Section ulasan dengan tab per produk — hanya 1 produk yang tampil sekaligus
const UlasanSection = ({
  produkList,
  semuaReview,
  ratingSanggar,
}: {
  produkList: BackendProduct[];
  semuaReview: BackendReview[];
  ratingSanggar: number;
}) => {
  const [activeId, setActiveId] = useState(produkList[0]?.id ?? null);
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 4;

  const produk = produkList.find((p) => p.id === activeId) ?? produkList[0];
  if (!produk) return null;

  const avgQuality = produk.reviews.reduce((s, r) => s + r.quality, 0) / produk.reviews.length;
  const avgPop     = produk.reviews.reduce((s, r) => s + r.popularity, 0) / produk.reviews.length;
  const avgDesign  = produk.reviews.reduce((s, r) => s + r.design, 0) / produk.reviews.length;
  const avgAll     = hitungRating(produk.reviews);
  const tampil     = showAll ? produk.reviews : produk.reviews.slice(0, LIMIT);

  const handleTabClick = (id: number) => {
    setActiveId(id);
    setShowAll(false);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl shadow-[0_8px_24px_rgba(88,56,34,0.07)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#e8dcc8]">
        <Star size={20} className="fill-[#eab308] text-[#eab308] shrink-0" />
        <h2 className="text-xl font-serif font-bold text-brown-900">Ulasan Pelanggan</h2>
        <span className="text-xs text-brown-600 bg-[#432f27]/10 px-2.5 py-1 rounded-full ml-auto shrink-0">
          {semuaReview.length} ulasan · {ratingSanggar.toFixed(1)} ★
        </span>
      </div>

      {/* Tab produk — scroll horizontal kalau banyak */}
      <div className="flex gap-2 px-6 py-3 overflow-x-auto border-b border-[#e8dcc8] scrollbar-thin">
        {produkList.map((p) => {
          const isActive = p.id === activeId;
          const r = hitungRating(p.reviews);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleTabClick(p.id)}
              className={`flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#432f27] text-white'
                  : 'bg-[#f5ead8] text-brown-800 hover:bg-[#e8dcc8]'
              }`}
            >
              {p.productName}
              <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-brown-500'}`}>
                ★ {r.toFixed(1)} ({p.reviews.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Konten produk aktif */}
      <div className="p-6">
        {/* Info produk aktif */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#f5ead8]">
            <img
              src={produk.image || '/batik 1.jpg'}
              alt={produk.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <Link
              to={`/produk/${produk.id}`}
              className="font-serif font-bold text-brown-900 text-sm hover:underline line-clamp-1"
            >
              {produk.productName}
            </Link>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={11}
                  className={s <= Math.round(avgAll) ? 'fill-[#eab308] text-[#eab308]' : 'fill-gray-200 text-gray-200'}
                />
              ))}
              <span className="text-xs text-brown-600 ml-1">{avgAll.toFixed(1)} · {produk.reviews.length} ulasan</span>
            </div>
          </div>
        </div>

        {/* Bar rata-rata per kriteria */}
        <div className="space-y-2 mb-6 max-w-xs">
          {([
            ['Kualitas', avgQuality],
            ['Popularitas', avgPop],
            ['Desain Batik', avgDesign],
          ] as [string, number][]).map(([label, val]) => (
            <div key={label} className="grid grid-cols-[90px_1fr_30px] items-center gap-3 text-xs text-brown-700">
              <span>{label}</span>
              <div className="h-[3px] rounded-full bg-[#e8dcc8]">
                <div className="h-full rounded-full bg-[#432f27]" style={{ width: `${(val / 5) * 100}%` }} />
              </div>
              <span className="text-right">{val.toFixed(1)}</span>
            </div>
          ))}
        </div>

        {/* Daftar komentar */}
        <div className="grid gap-5 sm:grid-cols-2">
          {tampil.map((review) => (
            <div key={review.id} className="flex gap-3">
              <Avatar name={review.reviewerName} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brown-900 truncate">{review.reviewerName}</p>
                <p className="text-xs text-brown-500 mb-1">{formatTanggal(review.createdAt)}</p>
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={11}
                      className={
                        s <= Math.round((review.quality + review.popularity + review.design) / 3)
                          ? 'fill-[#eab308] text-[#eab308]'
                          : 'fill-gray-200 text-gray-200'
                      }
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-brown-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {produk.reviews.length > LIMIT && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="mt-5 text-sm font-semibold text-[#432f27] underline underline-offset-2 hover:text-black transition-colors"
          >
            {showAll ? 'Sembunyikan ulasan' : `Lihat semua ${produk.reviews.length} ulasan`}
          </button>
        )}
      </div>
    </div>
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

  // Produk yang punya ulasan (untuk section reviews)
  const produkDenganUlasan = sanggar.products.filter((p) => p.reviews.length > 0);

  return (
    <div className="relative min-h-screen bg-[#f5ead8]">
      {/* Background Pattern */}
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

        {/* Reviews Section — tampil kalau ada minimal 1 produk dengan ulasan */}
        {produkDenganUlasan.length > 0 && (
          <div className="mb-16">
            <UlasanSection
              produkList={produkDenganUlasan}
              semuaReview={semuaReview}
              ratingSanggar={ratingSanggar}
            />
          </div>
        )}

        {/* Map Section */}
        <div className="mt-4">
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
