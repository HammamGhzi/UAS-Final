import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, ChevronLeft, Star } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { MapComponent } from '../../components/Map/MapComponent';
import { BatikPattern } from '../../assets/BatikPattern';

// =====================================================================
// DUMMY DATA — FRONTEND ONLY
// Field diambil dari interface Sanggar & Produk (src/types/index.ts),
// tapi cuma sebagian yang ditampilkan di UI biar gak penuh.
// Nanti tinggal diganti pakai data dari backend (sanggarApi.getById).
// =====================================================================

interface DummyProduk {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  motif: string;
  foto: string[];
  rating: number;
  jumlahReview: number;
}

interface DummySanggar {
  id: string;
  nama: string;
  alamat: string;
  wilayah: string;
  noHp: string;
  foto: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  rating: number;
  jumlahReview: number;
  produk: DummyProduk[];
}

const DUMMY_SANGGAR: DummySanggar[] = [
  {
    id: '1',
    nama: 'Rumah Batik Tegalan Maudy',
    alamat: 'Jl. Raya Tegal Barat No. 123',
    wilayah: 'Tegal Barat',
    noHp: '0812-3456-7890',
    foto: '/batik 1.jpg',
    deskripsi:
      'Sanggar batik pesisiran yang sudah berdiri sejak 1998, fokus pada motif khas Tegalan dengan teknik tulis halus turun-temurun.',
    latitude: -6.8694,
    longitude: 109.1402,
    rating: 4.8,
    jumlahReview: 128,
    produk: [
      {
        id: 'p1',
        nama: 'Batik Tulis Gagang Bayu',
        harga: 350000,
        kategori: 'Flora',
        motif: 'Gagang Bayu',
        foto: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80'],
        rating: 4.9,
        jumlahReview: 24,
      },
      {
        id: 'p2',
        nama: 'Batik Cap Mega Mendung',
        harga: 210000,
        kategori: 'Kontemporer',
        motif: 'Mega Mendung',
        foto: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'],
        rating: 4.7,
        jumlahReview: 15,
      },
      {
        id: 'p3',
        nama: 'Kain Batik Pesisir Biru',
        harga: 275000,
        kategori: 'Pesisir',
        motif: 'Ombak Segoro',
        foto: ['https://images.unsplash.com/photo-1600091166971-7f9faad6f574?w=800&q=80'],
        rating: 4.8,
        jumlahReview: 19,
      },
      {
        id: 'p4',
        nama: 'Batik Tulis Kawung Klasik',
        harga: 320000,
        kategori: 'Geometris',
        motif: 'Kawung',
        foto: ['https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=800&q=80'],
        rating: 4.6,
        jumlahReview: 11,
      },
    ],
  },
  {
    id: '2',
    nama: 'Batik Srikandi Tegal',
    alamat: 'Jl. Pemuda No. 45',
    wilayah: 'Tegal Timur',
    noHp: '0813-2233-4455',
    foto: 'https://images.unsplash.com/photo-1595231776515-ce9bb9f78d9f?w=1200&q=80',
    deskripsi:
      'Mengangkat motif flora dan fauna khas pesisir utara Jawa dengan pewarnaan alami dari tumbuhan lokal.',
    latitude: -6.8583,
    longitude: 109.1489,
    rating: 4.7,
    jumlahReview: 96,
    produk: [
      {
        id: 'p5',
        nama: 'Batik Tulis Sekar Jagad',
        harga: 400000,
        kategori: 'Flora',
        motif: 'Sekar Jagad',
        foto: ['https://images.unsplash.com/photo-1596466107123-b4b7c1b3b6a5?w=800&q=80'],
        rating: 4.8,
        jumlahReview: 18,
      },
      {
        id: 'p6',
        nama: 'Batik Cap Burung Merak',
        harga: 230000,
        kategori: 'Fauna',
        motif: 'Merak Ngigel',
        foto: ['https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=800&q=80'],
        rating: 4.6,
        jumlahReview: 9,
      },
      {
        id: 'p7',
        nama: 'Kain Batik Motif Udang',
        harga: 265000,
        kategori: 'Pesisir',
        motif: 'Udang Segoro',
        foto: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
        rating: 4.7,
        jumlahReview: 13,
      },
    ],
  },
  {
    id: '3',
    nama: 'Sanggar Batik Nusantara',
    alamat: 'Jl. Diponegoro No. 78',
    wilayah: 'Margadana',
    noHp: '0821-4455-6677',
    foto: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=1200&q=80',
    deskripsi:
      'Salah satu sanggar terbesar di Tegal dengan koleksi motif terlengkap, dari klasik sampai kontemporer.',
    latitude: -6.8802,
    longitude: 109.1085,
    rating: 4.9,
    jumlahReview: 156,
    produk: [
      {
        id: 'p8',
        nama: 'Batik Tulis Parang Rusak',
        harga: 450000,
        kategori: 'Geometris',
        motif: 'Parang Rusak',
        foto: ['https://images.unsplash.com/photo-1622467827417-bbe6b8c2b9b1?w=800&q=80'],
        rating: 5.0,
        jumlahReview: 21,
      },
      {
        id: 'p9',
        nama: 'Batik Cap Daun Sirih',
        harga: 190000,
        kategori: 'Flora',
        motif: 'Daun Sirih',
        foto: ['https://images.unsplash.com/photo-1600180716523-3b3e6e7f4f5a?w=800&q=80'],
        rating: 4.7,
        jumlahReview: 14,
      },
    ],
  },
  {
    id: '4',
    nama: 'Batik Indah Tegal',
    alamat: 'Jl. Kartini No. 12',
    wilayah: 'Tegal Barat',
    noHp: '0857-1122-3344',
    foto: 'https://images.unsplash.com/photo-1600091166959-3f9b0d4cb60a?w=1200&q=80',
    deskripsi:
      'Fokus pada batik cap untuk kebutuhan seragam dan produksi masal dengan harga terjangkau.',
    latitude: -6.8711,
    longitude: 109.1201,
    rating: 4.6,
    jumlahReview: 84,
    produk: [
      {
        id: 'p10',
        nama: 'Batik Cap Kotak Modern',
        harga: 150000,
        kategori: 'Geometris',
        motif: 'Kotak Modern',
        foto: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
        rating: 4.5,
        jumlahReview: 10,
      },
      {
        id: 'p11',
        nama: 'Batik Cap Benda Pesisir',
        harga: 175000,
        kategori: 'Benda',
        motif: 'Jangkar Segoro',
        foto: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80'],
        rating: 4.6,
        jumlahReview: 8,
      },
    ],
  },
  {
    id: '5',
    nama: 'Sanggar Batik Pesisir',
    alamat: 'Jl. Pantai No. 5',
    wilayah: 'Slawi',
    noHp: '0878-9900-1122',
    foto: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80',
    deskripsi:
      'Batik dengan warna-warna cerah khas pesisiran, favorit anak muda untuk dipakai sehari-hari.',
    latitude: -6.9622,
    longitude: 109.0872,
    rating: 4.5,
    jumlahReview: 67,
    produk: [
      {
        id: 'p12',
        nama: 'Batik Tulis Ombak Segoro',
        harga: 300000,
        kategori: 'Pesisir',
        motif: 'Ombak Segoro',
        foto: ['https://images.unsplash.com/photo-1600091166971-7f9faad6f574?w=800&q=80'],
        rating: 4.5,
        jumlahReview: 12,
      },
    ],
  },
  {
    id: '6',
    nama: 'Batik Keraton Tegal',
    alamat: 'Jl. Sultan Agung No. 33',
    wilayah: 'Tegal Timur',
    noHp: '0896-7788-9900',
    foto: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=1200&q=80',
    deskripsi:
      'Mengusung motif-motif keraton yang diadaptasi ke gaya pesisiran, banyak dipakai untuk acara resmi.',
    latitude: -6.8619,
    longitude: 109.1523,
    rating: 4.8,
    jumlahReview: 112,
    produk: [
      {
        id: 'p13',
        nama: 'Batik Tulis Sido Mukti',
        harga: 500000,
        kategori: 'Kontemporer',
        motif: 'Sido Mukti',
        foto: ['https://images.unsplash.com/photo-1622467827417-bbe6b8c2b9b1?w=800&q=80'],
        rating: 4.9,
        jumlahReview: 17,
      },
      {
        id: 'p14',
        nama: 'Batik Cap Truntum',
        harga: 240000,
        kategori: 'Geometris',
        motif: 'Truntum',
        foto: ['https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=800&q=80'],
        rating: 4.7,
        jumlahReview: 9,
      },
    ],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

// Card produk lokal (subset field dari model Produk: nama, harga, foto, rating, kategori, motif)
const DummyProductCard = ({ produk }: { produk: DummyProduk }) => (
  <Link to={`/produk/${produk.id}`}>
    <div className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-brown-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="h-32 sm:h-36 overflow-hidden bg-brown-100 relative">
        <img
          src={produk.foto[0]}
          alt={produk.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-[#432f27]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {produk.kategori}
        </span>
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-brown-900 text-sm mb-1 line-clamp-1">
          {produk.nama}
        </h3>
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="fill-[#b08d28] text-[#b08d28]" />
          <span className="text-xs text-brown-700">{produk.rating.toFixed(1)}</span>
          <span className="text-[11px] text-brown-500">({produk.jumlahReview})</span>
        </div>
        <p className="text-[#b08d28] font-bold text-sm mt-auto">{formatPrice(produk.harga)}</p>
      </div>
    </div>
  </Link>
);

const SanggarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sementara masih pakai dummy data, belum ke backend.
  // Nanti tinggal ganti bagian ini pakai sanggarApi.getById(id) + useQuery v5:
  // const { data: sanggar, isLoading, error } = useQuery({
  //   queryKey: ['sanggar', id],
  //   queryFn: () => sanggarApi.getById(id!),
  //   enabled: !!id,
  // });
  const sanggar = DUMMY_SANGGAR.find((item) => item.id === id);

  if (!sanggar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5ead8]">
        <div className="text-2xl font-serif text-brown-900">Sanggar tidak ditemukan</div>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

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

        {/* Sanggar Header — field: foto, nama, rating, jumlahReview, deskripsi, alamat, wilayah, noHp */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 mb-10 shadow-[0_16px_40px_rgba(88,56,34,0.08)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={sanggar.foto}
                alt={sanggar.nama}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
                {sanggar.nama}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(sanggar.rating)
                        ? 'fill-[#eab308] text-[#eab308]'
                        : 'fill-gray-200 text-gray-200'
                    }
                  />
                ))}
                <span className="text-brown-700 text-sm">
                  {sanggar.rating.toFixed(1)} ({sanggar.jumlahReview} ulasan)
                </span>
              </div>

              <p className="text-brown-700 mb-5 leading-relaxed">{sanggar.deskripsi}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-[#b08d28] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-brown-800">Alamat</h3>
                    <p className="text-sm text-brown-700">
                      {sanggar.alamat}, {sanggar.wilayah}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={18} className="text-[#b08d28] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-brown-800">Kontak</h3>
                    <p className="text-sm text-brown-700">{sanggar.noHp}</p>
                  </div>
                </div>
              </div>

              <Button variant="secondary" className="w-full md:w-auto">
                Hubungi Sanggar
              </Button>
            </div>
          </div>
        </div>

        {/* Products Section — field: nama, harga, foto, rating, kategori, motif */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-brown-900 mb-6">
            Produk Sanggar
          </h2>

          {sanggar.produk.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sanggar.produk.map((produk) => (
                <DummyProductCard key={produk.id} produk={produk} />
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
              latitude={sanggar.latitude}
              longitude={sanggar.longitude}
              nama={sanggar.nama}
              alamat={sanggar.alamat}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SanggarDetail;