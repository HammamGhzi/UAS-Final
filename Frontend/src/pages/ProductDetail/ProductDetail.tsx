import { useAuthStore } from '../../stores/useAuthStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Share2, ShieldCheck, Star } from 'lucide-react';
import { productApi, reviewApi } from '../../services/api';
import { MapComponent } from '../../components/Map/MapComponent';

// Bentuk data persis seperti yang dibalikin getProductById di backend
// (include: { sanggar: true, category: true, reviews: true })
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
  stock: number;
  description: string | null;
  image: string | null;
  category?: { id: number; categoryName: string } | null;
  sanggar: {
    id: number;
    name: string;
    address: string;
    latitude: number | string;
    longitude: number | string;
    phone: string | null;
    description: string | null;
  };
  reviews: BackendReview[];
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
    .format(n)
    .replace('IDR', 'Rp');

// Hitung rating rata-rata dari kumpulan review (quality, popularity, design)
const hitungAvg = (reviews: BackendReview[]) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + (r.quality + r.popularity + r.design) / 3, 0);
  return total / reviews.length;
};

const RatingStars = ({
  value,
  onChange,
  size = 26,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => onChange?.(item)}
        className={onChange ? 'leading-none' : 'pointer-events-none leading-none'}
        aria-label={`${item} stars`}
      >
        <Star
          size={size}
          className={item <= value ? 'fill-[#ff9c07] text-[#ff9c07]' : 'fill-transparent text-[#9aa0a6]'}
          strokeWidth={1.8}
        />
      </button>
    ))}
  </div>
);

// Avatar bulat dari inisial nama reviewer
const Avatar = ({ name }: { name: string }) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#432f27] text-base font-semibold text-white">
      {initial}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  // Cuma role USER (bukan ADMIN / SUPER_ADMIN) yang boleh kasih rating produk
  const isUser = isLoggedIn && user?.role === 'USER';

  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    reviewerName: '',
    quality: 4,
    popularity: 3,
    design: 4,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const REVIEWS_LIMIT = 6;
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['produk', id],
    queryFn: async () => {
      const res = await productApi.getById(Number(id));
      return res.data.data as BackendProduct;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff6e3]">
        <div className="text-[#5c574e]">Memuat data produk...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fff6e3]">
        <div className="text-2xl font-semibold text-[#15110c]">Produk tidak ditemukan</div>
        <button
          onClick={() => navigate('/produk')}
          className="rounded-md border border-black px-5 py-2 text-sm font-semibold"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const reviews = product.reviews;
  const avgAll = hitungAvg(reviews);
  const price = Number(product.price);
  const totalHarga = price * qty;
  const maxQty = Math.max(product.stock, 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!isUser) {
      navigate('/form/login');
      return;
    }

    const reviewerName = form.reviewerName.trim() || user?.email || 'Pengunjung';

    try {
      setSubmitting(true);
      await reviewApi.create({
        productId: product.id,
        userId: user?.id ?? null,
        reviewerName,
        quality: form.quality,
        popularity: form.popularity,
        design: form.design,
        comment: form.comment.trim() || undefined,
      });

      // Refresh data produk ini (reviews & rating produk)
      await queryClient.invalidateQueries({ queryKey: ['produk', id] });
      // Refresh juga data sanggar-nya, karena rating sanggar dihitung
      // dari rata-rata semua review produk miliknya
      await queryClient.invalidateQueries({ queryKey: ['sanggar', String(product.sanggar.id)] });

      setForm({ reviewerName: '', quality: 4, popularity: 3, design: 4, comment: '' });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError('Gagal mengirim ulasan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff6e3] text-[#15110c]">
      <section className="relative mx-auto max-w-[1130px] px-5 pb-10 pt-12 sm:px-8 lg:px-0">
        <img
          src="/batik-pattern-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-155px] top-[170px] z-0 hidden w-[470px] opacity-45 md:block"
        />
        <img
          src="/batik-pattern-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-24px] left-[18px] z-0 hidden w-[620px] opacity-30 md:block"
        />

        <div className="relative z-10">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[30px] font-semibold tracking-normal md:text-[34px]">{product.productName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#626262]">
                <Star size={15} className="fill-[#ff385c] text-[#ff385c]" />
                <span className="font-medium text-black">{avgAll.toFixed(1)}</span>
                <span>-</span>
                <a href="#ulasan" className="font-medium text-black underline underline-offset-2">
                  {reviews.length} reviews
                </a>
                {product.category && (
                  <>
                    <span>-</span>
                    <ShieldCheck size={15} className="text-[#ff385c]" />
                    <span>{product.category.categoryName}</span>
                  </>
                )}
                <span>-</span>
                <a href="#lokasi" className="underline underline-offset-2">
                  {product.sanggar.address}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm font-medium">
              <button
                onClick={async () => {
                  const url = window.location.href;
                  const title = product.productName;
                  if (navigator.share) {
                    try {
                      await navigator.share({ title, text: `Lihat produk batik: ${title}`, url });
                    } catch (_) {}
                  } else {
                    navigator.clipboard?.writeText(url);
                    alert('Link berhasil disalin!');
                  }
                }}
                className="flex items-center gap-1.5 hover:underline"
              >
                <Share2 size={16} /> Bagikan
              </button>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_370px]">
            <div>
              <div className="overflow-hidden rounded-lg bg-white">
                <img
                  src={product.image || '/batik 1.jpg'}
                  alt={product.productName}
                  className="h-[300px] w-full object-cover sm:h-[390px]"
                />
              </div>

              <div className="border-b border-[#e3dac6] py-5">
                <Link to={`/sanggar/${product.sanggar.id}`} className="hover:underline">
                  <h2 className="text-[26px] font-semibold leading-tight">{product.sanggar.name}</h2>
                </Link>
                {product.sanggar.description && (
                  <p className="mt-2 text-sm">{product.sanggar.description}</p>
                )}
              </div>
            </div>

            <aside className="lg:pt-[6px]">
              <div className="mb-7">
                <p className="mb-3 text-base text-[#3f3b35]">
                  {maxQty > 0 ? `${maxQty} stok tersedia` : 'Stok habis'}
                </p>
                <div className="grid w-[190px] grid-cols-[44px_1fr_44px] overflow-hidden rounded-lg border border-[#f1eadb] bg-white/60">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-11 text-lg disabled:opacity-40"
                    disabled={maxQty === 0}
                  >
                    -
                  </button>
                  <div className="flex h-11 items-center justify-center border-x border-[#f1eadb] text-sm">
                    {maxQty === 0 ? 0 : qty}
                  </div>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="h-11 text-lg disabled:opacity-40"
                    disabled={maxQty === 0 || qty >= maxQty}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#ded5c2] bg-[#fff8e9] p-6 shadow-[0_16px_32px_rgba(57,45,26,0.14)]">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold">{formatPrice(price)}</p>
                  <a href="#ulasan" className="flex items-center gap-1 text-sm underline underline-offset-2">
                    <Star size={14} className="fill-[#ff385c] text-[#ff385c]" />
                    <span>{avgAll.toFixed(1)}</span>
                    <span>-</span>
                    <span>{reviews.length} reviews</span>
                  </a>
                </div>

                <div className="space-y-4 border-b border-[#e5dcc7] pb-5 text-base">
                  <div className="flex justify-between gap-4">
                    <span>{maxQty === 0 ? 0 : qty} Produk</span>
                    <span>{formatPrice(maxQty === 0 ? 0 : totalHarga)}</span>
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-5 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(maxQty === 0 ? 0 : totalHarga)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1130px] px-5 pb-12 sm:px-8 lg:px-0">
        <div className="grid gap-8 rounded-2xl border border-[#d8cdb8] p-6 md:grid-cols-[1.05fr_0.95fr] md:p-12 lg:px-16">
          <article className="md:py-5">
            <h2 className="mb-5 text-2xl font-semibold">Deskripsi Produk</h2>
            {product.description ? (
              <p className="mb-4 whitespace-pre-line text-sm leading-relaxed">{product.description}</p>
            ) : (
              <p className="mb-4 text-sm leading-relaxed text-[#7b756b]">Belum ada deskripsi untuk produk ini.</p>
            )}
            {product.category && (
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Kategori:</span> {product.category.categoryName}
              </p>
            )}
          </article>

          <form onSubmit={handleSubmit} className="rounded-xl border border-[#d8cdb8] bg-[#fff8e9] p-4 md:p-5">
            <h2 className="text-lg font-semibold">Nilai Produk Kami!</h2>
            <p className="mt-3 text-xs text-[#626262]">Bagaimana kualitas produk kami?</p>

            {!isUser && (
              <div className="mt-4 rounded-lg border border-[#ead9b5] bg-[#fff1cf] px-4 py-3 text-xs font-medium text-[#7a5a24]">
                {isLoggedIn
                  ? 'Fitur rating hanya untuk akun pengguna biasa, bukan admin sanggar.'
                  : 'Login sebagai pengguna dulu untuk memberi rating dan feedback produk.'}
              </div>
            )}

            {isUser && (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-[#5c574e]" htmlFor="reviewerName">
                  Nama
                </label>
                <input
                  id="reviewerName"
                  type="text"
                  value={form.reviewerName}
                  onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                  placeholder={user?.email || 'Nama kamu'}
                  className="w-full rounded-md border border-[#e3dac6] bg-[#fff6e3] px-3 py-2 text-sm outline-none transition focus:border-[#9d8765]"
                />
              </div>
            )}

            <div className="mt-5 space-y-5">
              {([
                ['Kualitas', 'quality'],
                ['Popularitas', 'popularity'],
                ['Desain Batik', 'design'],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <p className="mb-2 text-xs font-semibold text-[#5c574e]">{label}</p>
                  <RatingStars
                    value={form[key]}
                    onChange={isUser ? (value) => setForm({ ...form, [key]: value }) : undefined}
                  />
                </div>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold text-[#5c574e]" htmlFor="feedback">
              *Opsional
            </label>
            <textarea
              id="feedback"
              value={form.comment}
              onChange={(event) => setForm({ ...form, comment: event.target.value })}
              placeholder="Tambahkan feedback"
              rows={5}
              disabled={!isUser}
              className="mt-2 w-full resize-none rounded-md border border-[#e3dac6] bg-[#fff6e3] px-3 py-3 text-sm outline-none transition focus:border-[#9d8765] disabled:cursor-not-allowed disabled:opacity-70"
            />
            {submitError && <p className="mt-2 text-xs font-medium text-red-600">{submitError}</p>}
            {submitSuccess && (
              <p className="mt-2 text-xs font-medium text-green-700">Terima kasih! Ulasan kamu sudah tersimpan.</p>
            )}
            <button
              type="submit"
              disabled={submitting || !isUser}
              className="mt-3 h-11 w-full rounded-md bg-[#a7e600] text-sm font-semibold text-white disabled:opacity-60"
            >
              {isUser ? (submitting ? 'Mengirim...' : 'Submit') : 'Login sebagai User untuk Submit'}
            </button>
          </form>
        </div>
      </section>

      <section id="ulasan" className="mx-auto max-w-[1130px] px-5 pb-14 sm:px-8 lg:px-0">
        <div className="mb-7 flex items-center gap-2">
          <Star size={22} className="fill-[#ff385c] text-[#ff385c]" />
          <h2 className="text-2xl font-semibold">
            {avgAll.toFixed(1)} - {reviews.length} reviews
          </h2>
        </div>

        {reviews.length > 0 ? (
          <>
            <div className="mb-10 max-w-[470px] space-y-5">
              {([
                ['Kualitas', reviews.reduce((total, r) => total + r.quality, 0) / reviews.length],
                ['Popularitas', reviews.reduce((total, r) => total + r.popularity, 0) / reviews.length],
                ['Desain Batik', reviews.reduce((total, r) => total + r.design, 0) / reviews.length],
              ] as [string, number][]).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr_34px] items-center gap-4 text-sm">
                  <span>{label}</span>
                  <div className="h-[3px] bg-[#d9cfbb]">
                    <div className="h-full bg-black" style={{ width: `${(value / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-x-24 gap-y-10 md:grid-cols-2">
              {(showAllReviews ? reviews : reviews.slice(0, REVIEWS_LIMIT)).map((review) => (
                <article key={review.id}>
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar name={review.reviewerName} />
                    <div>
                      <p className="font-semibold">{review.reviewerName}</p>
                      <p className="text-xs text-[#7b756b]">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm leading-relaxed">{review.comment}</p>}
                </article>
              ))}
            </div>

            {reviews.length > REVIEWS_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="mt-8 underline text-sm font-semibold text-[#432f27] hover:text-black transition-colors"
              >
                {showAllReviews ? 'Sembunyikan ulasan' : `Lihat semua ${reviews.length} ulasan`}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-[#7b756b]">Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
        )}
      </section>

      <section id="lokasi" className="mx-auto max-w-[1130px] px-5 pb-20 sm:px-8 lg:px-0">
        <div className="overflow-hidden rounded-sm border border-[#d8cdb8]">
          <MapComponent
            latitude={Number(product.sanggar.latitude)}
            longitude={Number(product.sanggar.longitude)}
            nama={product.sanggar.name}
            alamat={product.sanggar.address}
          />
        </div>

        <h2 className="mt-8 text-base font-semibold">{product.sanggar.name}</h2>
        <p className="mt-4 max-w-[980px] text-sm leading-relaxed">{product.sanggar.address}</p>
        <Link to={`/sanggar/${product.sanggar.id}`} className="mt-4 inline-block text-sm font-semibold underline">
          Lihat detail sanggar
        </Link>
      </section>
    </main>
  );
};

export default ProductDetail;