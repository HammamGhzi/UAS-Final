import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BatikPattern } from '../../assets/BatikPattern';
import { SanggarCard } from '../../components/Sanggar/SanggarCard';
import { Button } from '../../components/UI/Button';

const Home = () => {
  const navigate = useNavigate();
  const [wilayah, setWilayah] = useState('');
  const [jenisBatik, setJenisBatik] = useState('');

  const categories = [
    { name: 'Flora', produk: 12, image: '/category-flora.jpg' },
    { name: 'Fauna', produk: 7, image: '/category-fauna.jpg' },
    { name: 'Geometris', produk: 19, image: '/category-geometris.jpg' },
    { name: 'Benda', produk: 6, image: '/category-benda.jpg' },
    { name: 'Pesisir', produk: 15, image: '/category-pesisir.jpg' },
    { name: 'Kontemporer', produk: 9, image: '/category-kontemporer.jpg' },
  ];

  const topSanggar = [
    {
      id: '1',
      nama: 'Rumah Batik Tegalan Maudy',
      foto: '/sanggar1.jpg',
      alamat: 'Jl. Raya Tegal Barat No. 123',
      wilayah: 'Tegal Barat',
      rating: 4.8,
      jumlahReview: 128,
      jumlahProduk: 45,
    },
    {
      id: '2',
      nama: 'Batik Srikandi Tegal',
      foto: '/sanggar2.jpg',
      alamat: 'Jl. Pemuda No. 45',
      wilayah: 'Tegal Timur',
      rating: 4.7,
      jumlahReview: 96,
      jumlahProduk: 38,
    },
    {
      id: '3',
      nama: 'Sanggar Batik Nusantara',
      foto: '/sanggar3.jpg',
      alamat: 'Jl. Diponegoro No. 78',
      wilayah: 'Margadana',
      rating: 4.9,
      jumlahReview: 156,
      jumlahProduk: 52,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/katalog?wilayah=${wilayah}&jenis=${jenisBatik}`);
  };

  return (
    <div className="bg-cream-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-cream-100">
        <div className="absolute inset-0 pointer-events-none">
          <BatikPattern className="w-full h-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-brown-900 mb-4"
          >
            Cari Batik Tegalan Terbaik
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-brown-700 mb-8 max-w-2xl mx-auto"
          >
            Temukan Sanggar batik pesisiran terbaik di Tegal dengan rekomendasi cerdas
            berdasarkan jarak dan jenis batik pilihanmu
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none bg-white"
                >
                  <option value="">Semua Wilayah</option>
                  <option value="tegal-barat">Tegal Barat</option>
                  <option value="tegal-timur">Tegal Timur</option>
                  <option value="tegal-selatan">Tegal Selatan</option>
                  <option value="margadana">Margadana</option>
                  <option value="slawi">Slawi</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={jenisBatik}
                  onChange={(e) => setJenisBatik(e.target.value)}
                  className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none bg-white"
                >
                  <option value="">Pilih Jenis Batik</option>
                  <option value="flora">Flora</option>
                  <option value="fauna">Fauna</option>
                  <option value="geometris">Geometris</option>
                  <option value="benda">Benda</option>
                </select>
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Search size={20} />
                Cari Sekarang
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Top Sanggar Section */}
      <section id="sanggar-section" className="relative py-16 px-4 bg-cream-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <BatikPattern className="w-full h-full" variant="center" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-brown-900 mb-2">
              Sanggar Batik Rekomendasi
            </h2>
            <p className="text-brown-600">Top Sanggar dengan rating tertinggi</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topSanggar.map((sanggar) => (
              <SanggarCard key={sanggar.id} {...sanggar} />
            ))}
          </div>

        </div>
      </section>

     {/* Promo Section */}
      <section className="py-16 px-4 bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-orange-300 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Promo Spesial Anniversary!
                </h3>
                <p className="text-white/90 mb-6 text-sm">
                  Dapatkan Promo Hingga 15% untuk pembelian minimal Rp 500.000.
                  Promo hingga 1 Juli 2026, S&K Berlaku.
                </p>
                <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition text-sm">
                  Lihat Ketentuan
                </button>
              </div>
              <div className="hidden md:block">
                <img
                  src="/promo-batik.png"
                  alt="Promo Batik"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section className="py-16 px-4 bg-cream-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-brown-900 mb-4">
            Tentang Canting
          </h2>
          <p className="text-brown-700 leading-relaxed">
            CANTING adalah platform digital yang menghadirkan pengalaman terbaik
            dalam menemukan dan membeli Batik Tegalan asli. Kami bekerja sama dengan
            sanggar-sanggar batik terpercaya di Tegal untuk memastikan kualitas dan
            keaslian setiap produk yang ditawarkan.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section id="katalog-section" className="py-16 px-4 bg-cream-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-brown-900 mb-2">
              Temukan batik yang kamu suka
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer"
                onClick={() => navigate(`/katalog?kategori=${cat.name.toLowerCase()}`)}
              >
                <div className="aspect-video rounded-2xl overflow-hidden bg-brown-800 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                    <p className="text-white/80 text-sm">{cat.produk} Produk</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;