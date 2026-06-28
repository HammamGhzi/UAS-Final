import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Heart, MapPin, Share2, ShieldCheck, Star } from 'lucide-react';

const DUMMY_PRODUCT = {
  id: '1',
  nama: 'Batik Maung Persib',
  harga: 110123,
  kategori: 'Kain',
  motif: 'Mega Mendung',
  jenisKain: 'Katun Primisima Premium (Adem & Tidak Panas)',
  teknik: 'Tulis Halus (Hand-drawn)',
  foto: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85',
    'https://images.unsplash.com/photo-1600091166971-7f9faad6f574?w=900&q=85',
  ],
  rating: 5.0,
  jumlahReview: 7,
  sanggar: {
    id: 's1',
    nama: 'Rumah Batik Maudy',
    alamat: 'Jl. Batik No. 12',
    wilayah: 'Bordeaux, France',
    deskripsi: 'Terdapat Kamar Ganti dan Kamar Mandi',
    latitude: -6.9175,
    longitude: 109.1398,
    rating: 5.0,
    jumlahReview: 7,
  },
};

const DUMMY_REVIEWS = [
  { id: 'r1', nama: 'Jose', avatar: 'https://i.pravatar.cc/80?img=1', kualitas: 5, popularitas: 5, desain: 5, komentar: 'Host was very attentive.', tanggal: '2021-12-10' },
  { id: 'r2', nama: 'Luke', avatar: 'https://i.pravatar.cc/80?img=2', kualitas: 5, popularitas: 5, desain: 5, komentar: 'Nice place to stay!', tanggal: '2021-12-08' },
  { id: 'r3', nama: 'Shayna', avatar: 'https://i.pravatar.cc/80?img=3', kualitas: 5, popularitas: 4, desain: 5, komentar: 'Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive.', tanggal: '2021-12-05' },
  { id: 'r4', nama: 'Josh', avatar: 'https://i.pravatar.cc/80?img=4', kualitas: 4, popularitas: 5, desain: 5, komentar: 'Well designed and fun space, neighborhood has lots of energy and amenities.', tanggal: '2021-11-20' },
  { id: 'r5', nama: 'Vladko', avatar: 'https://i.pravatar.cc/80?img=5', kualitas: 5, popularitas: 5, desain: 4, komentar: 'This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price.', tanggal: '2020-11-15' },
  { id: 'r6', nama: 'Jennifer', avatar: 'https://i.pravatar.cc/80?img=6', kualitas: 5, popularitas: 5, desain: 5, komentar: 'A centric place, near of a sub station and a supermarket with everything you need.', tanggal: '2022-01-03' },
];

const SIZES = ['XL', 'L', 'M', 'S'];

const formatPrice = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
    .format(n)
    .replace('IDR', 'Rp');

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

const ProductDetail = () => {
  useParams();
  const navigate = useNavigate();
  const product = DUMMY_PRODUCT;
  const isLoggedIn = Boolean(localStorage.getItem('adminToken'));

  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [selectedSize, setSelectedSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ kualitas: 4, popularitas: 3, desain: 2, komentar: '' });

  const avgAll = reviews.reduce((total, review) => total + (review.kualitas + review.popularitas + review.desain) / 3, 0) / reviews.length;
  const totalHarga = product.harga * qty;
  const discount = Math.round(totalHarga * 0.1);
  const serviceFee = 50000;
  const taxes = 78000;
  const grandTotal = totalHarga - discount + serviceFee + taxes;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    setReviews([
      {
        id: `r${Date.now()}`,
        nama: 'Pengunjung',
        avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 60) + 1}`,
        tanggal: new Date().toISOString(),
        ...form,
        komentar: form.komentar.trim() || 'Produk batiknya bagus dan nyaman dipakai.',
      },
      ...reviews,
    ]);
    setForm({ kualitas: 4, popularitas: 3, desain: 2, komentar: '' });
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
              <h1 className="text-[30px] font-semibold tracking-normal md:text-[34px]">{product.nama}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#626262]">
                <Star size={15} className="fill-[#ff385c] text-[#ff385c]" />
                <span className="font-medium text-black">{avgAll.toFixed(1)}</span>
                <span>-</span>
                <a href="#ulasan" className="font-medium text-black underline underline-offset-2">
                  {reviews.length} reviews
                </a>
                <span>-</span>
                <ShieldCheck size={15} className="text-[#ff385c]" />
                <span>Superhost</span>
                <span>-</span>
                <a href="#lokasi" className="underline underline-offset-2">
                  {product.sanggar.wilayah}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm font-medium">
              <button className="flex items-center gap-1.5 hover:underline">
                <Share2 size={16} /> Share
              </button>
              <button onClick={() => setSaved(!saved)} className="flex items-center gap-1.5 hover:underline">
                <Heart size={16} className={saved ? 'fill-[#ff385c] text-[#ff385c]' : ''} /> Save
              </button>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_370px]">
            <div>
              <div className="overflow-hidden rounded-lg bg-white">
                <img src={product.foto[0]} alt={product.nama} className="h-[300px] w-full object-cover sm:h-[390px]" />
              </div>

              <div className="border-b border-[#e3dac6] py-5">
                <h2 className="text-[26px] font-semibold leading-tight">{product.sanggar.nama}</h2>
                <p className="mt-2 text-sm">{product.sanggar.deskripsi}</p>
              </div>
            </div>

            <aside className="lg:pt-[6px]">
              <div className="mb-7">
                <p className="mb-4 inline-block border-b border-black text-xl uppercase tracking-wide">SIZE</p>
                <div className="mb-6 flex items-center gap-7 text-lg">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`transition ${selectedSize === size ? 'font-semibold text-black' : 'text-[#3f3b35]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="mb-3 text-base text-[#3f3b35]">2 in stock</p>
                <div className="grid w-[190px] grid-cols-[44px_1fr_44px] overflow-hidden rounded-lg border border-[#f1eadb] bg-white/60">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 text-lg">
                    -
                  </button>
                  <div className="flex h-11 items-center justify-center border-x border-[#f1eadb] text-sm">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} className="h-11 text-lg">
                    +
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#ded5c2] bg-[#fff8e9] p-6 shadow-[0_16px_32px_rgba(57,45,26,0.14)]">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold">{formatPrice(product.harga)}</p>
                  <a href="#ulasan" className="flex items-center gap-1 text-sm underline underline-offset-2">
                    <Star size={14} className="fill-[#ff385c] text-[#ff385c]" />
                    <span>{avgAll.toFixed(1)}</span>
                    <span>-</span>
                    <span>{reviews.length} reviews</span>
                  </a>
                </div>

                <div className="space-y-4 border-b border-[#e5dcc7] pb-5 text-base">
                  <div className="flex justify-between gap-4">
                    <span>{qty} Produk</span>
                    <span>{formatPrice(totalHarga)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Weekly discount</span>
                    <span className="text-[#008a5a]">-{formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Service fee</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Occupancy taxes and fees</span>
                    <span>{formatPrice(taxes)}</span>
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-5 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
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
            <p className="mb-4 text-sm leading-relaxed">
              Hadirkan sentuhan kearifan lokal Tegal dalam penampilan Anda. Batik Tegalan motif "Gagang Bayu" ini
              dibuat secara tradisional dengan teknik tulis halus yang memadukan keindahan filosofi alam dengan
              warna-warna kontras yang berani, ciri khas utama batik pesisiran Tegal.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              Terbuat dari bahan katun primisima premium yang lembut dan mampu menyerap keringat dengan sempurna,
              kemeja ini sangat cocok digunakan untuk acara formal maupun kegiatan sehari-hari. Setiap helai kain
              melalui proses pewarnaan alami yang memastikan warna tidak mudah pudar dan tetap tampak elegan.
            </p>
            <h3 className="text-sm font-semibold">Spesifikasi Produk:</h3>
            <ul className="mb-4 mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>Bahan: {product.jenisKain}</li>
              <li>Teknik: {product.teknik}</li>
              <li>Warna: Kombinasi Merah Marun dan Biru Dongker dengan aksen emas.</li>
              <li>Perawatan: Disarankan mencuci dengan lerak atau sampo, jangan menggunakan mesin cuci.</li>
            </ul>
            <h3 className="text-sm font-semibold">Pilihan Ukuran:</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>S: Lebar Bahu 42cm | Panjang Baju 70cm</li>
              <li>M: Lebar Bahu 44cm | Panjang Baju 72cm</li>
              <li>L: Lebar Bahu 46cm | Panjang Baju 74cm</li>
              <li>XL: Lebar Bahu 48cm | Panjang Baju 76cm</li>
            </ul>
          </article>

          <form onSubmit={handleSubmit} className="rounded-xl border border-[#d8cdb8] bg-[#fff8e9] p-4 md:p-5">
            <h2 className="text-lg font-semibold">Nilai Produk Kami!</h2>
            <p className="mt-3 text-xs text-[#626262]">Bagaimana kualitas produk kami?</p>
            {!isLoggedIn && (
              <div className="mt-4 rounded-lg border border-[#ead9b5] bg-[#fff1cf] px-4 py-3 text-xs font-medium text-[#7a5a24]">
                Login dulu untuk memberi rating dan feedback produk.
              </div>
            )}

            <div className="mt-5 space-y-5">
              {([
                ['Kualitas', 'kualitas'],
                ['Popularitas', 'popularitas'],
                ['Desain Batik', 'desain'],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <p className="mb-2 text-xs font-semibold text-[#5c574e]">{label}</p>
                  <RatingStars
                    value={form[key]}
                    onChange={isLoggedIn ? (value) => setForm({ ...form, [key]: value }) : undefined}
                  />
                </div>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold text-[#5c574e]" htmlFor="feedback">
              *Opsional
            </label>
            <textarea
              id="feedback"
              value={form.komentar}
              onChange={(event) => setForm({ ...form, komentar: event.target.value })}
              placeholder="Tambahkan feedback"
              rows={5}
              disabled={!isLoggedIn}
              className="mt-2 w-full resize-none rounded-md border border-[#e3dac6] bg-[#fff6e3] px-3 py-3 text-sm outline-none transition focus:border-[#9d8765] disabled:cursor-not-allowed disabled:opacity-70"
            />
            <button type="submit" className="mt-3 h-11 w-full rounded-md bg-[#a7e600] text-sm font-semibold text-white">
              {isLoggedIn ? 'Submit' : 'Login untuk Submit'}
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

        <div className="mb-10 max-w-[470px] space-y-5">
          {([
            ['Kualitas', reviews.reduce((total, review) => total + review.kualitas, 0) / reviews.length],
            ['Popularitas', reviews.reduce((total, review) => total + review.popularitas, 0) / reviews.length],
            ['Desain Batik', reviews.reduce((total, review) => total + review.desain, 0) / reviews.length],
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
          {reviews.slice(0, 6).map((review) => (
            <article key={review.id}>
              <div className="mb-4 flex items-center gap-4">
                <img src={review.avatar} alt={review.nama} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{review.nama}</p>
                  <p className="text-xs text-[#7b756b]">
                    {new Date(review.tanggal).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{review.komentar}</p>
              {review.komentar.length > 95 && <button className="mt-3 text-sm font-semibold underline">Show more</button>}
            </article>
          ))}
        </div>

        <button className="mt-10 rounded-md border border-black px-5 py-2 text-sm font-semibold">
          Show all {reviews.length} reviews
        </button>
      </section>

      <section id="lokasi" className="mx-auto max-w-[1130px] px-5 pb-20 sm:px-8 lg:px-0">
        <div className="relative h-[330px] overflow-hidden rounded-sm border border-[#d8cdb8] bg-[#e9e3d3]">
          <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(30deg,rgba(255,255,255,.35)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.35)_87.5%,rgba(255,255,255,.35)),linear-gradient(150deg,rgba(255,255,255,.35)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.35)_87.5%,rgba(255,255,255,.35)),linear-gradient(30deg,rgba(255,255,255,.35)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.35)_87.5%,rgba(255,255,255,.35)),linear-gradient(150deg,rgba(255,255,255,.35)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.35)_87.5%,rgba(255,255,255,.35)),linear-gradient(60deg,rgba(211,202,184,.45)_25%,transparent_25.5%,transparent_75%,rgba(211,202,184,.45)_75%,rgba(211,202,184,.45)),linear-gradient(60deg,rgba(211,202,184,.45)_25%,transparent_25.5%,transparent_75%,rgba(211,202,184,.45)_75%,rgba(211,202,184,.45))] [background-position:0_0,0_0,20px_35px,20px_35px,0_0,20px_35px] [background-size:40px_70px]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-sm bg-white px-5 py-4 text-sm shadow-lg">
            <span>Exact location provided after booking</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff385c] text-white">
              <MapPin size={18} />
            </span>
          </div>
        </div>

        <h2 className="mt-8 text-base font-semibold">Bordeaux, Nouvelle-Aquitaine, France</h2>
        <p className="mt-4 max-w-[980px] text-sm leading-relaxed">
          Very dynamic and appreciated district by the people of Bordeaux thanks to rue St James and place Fernand
          Lafargue. Home to many historical monuments such as the Grosse Cloche, the Porte de Bourgogne and the Porte
          Cailhau, and cultural sites such as the Aquitaine Museum.
        </p>
        <button className="mt-4 text-sm font-semibold underline">Show more</button>
      </section>
    </main>
  );
};

export default ProductDetail;
