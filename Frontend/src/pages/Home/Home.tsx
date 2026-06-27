import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, MousePointer2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { BatikPattern } from "../../assets/BatikPattern";
import { SanggarCarousel } from "../../components/Sanggar/SanggarCarousel";

const Home = () => {
  const navigate = useNavigate();
  const [wilayah, setWilayah] = useState("");
  const [jenisBatik, setJenisBatik] = useState("");

  const categories = [
    { name: "Flora", produk: 12, image: "/category-flora.jpg" },
    { name: "Fauna", produk: 7, image: "/category-fauna.jpg" },
    { name: "Geometris", produk: 19, image: "/category-geometris.jpg" },
    { name: "Benda", produk: 6, image: "/category-benda.jpg" },
    { name: "Pesisir", produk: 15, image: "/category-pesisir.jpg" },
    { name: "Kontemporer", produk: 9, image: "/category-kontemporer.jpg" },
  ];

  const topSanggar = [
    {
      id: "1",
      nama: "Rumah Batik Tegalan Maudy",
      foto: "/batik 1.jpg ",
      alamat: "Jl. Raya Tegal Barat No. 123",
      wilayah: "Tegal Barat",
      rating: 4.8,
      jumlahReview: 128,
      jumlahProduk: 45,
    },
    {
      id: "2",
      nama: "Batik Srikandi Tegal",
      foto: "/batik 1.jpg",
      alamat: "Jl. Pemuda No. 45",
      wilayah: "Tegal Timur",
      rating: 4.7,
      jumlahReview: 96,
      jumlahProduk: 38,
    },
    {
      id: "3",
      nama: "Sanggar Batik Nusantara",
      foto: "/batik 1.jpg",
      alamat: "Jl. Diponegoro No. 78",
      wilayah: "Margadana",
      rating: 4.9,
      jumlahReview: 156,
      jumlahProduk: 52,
    },
    {
      id: "4",
      nama: "Batik Indah Tegal",
      foto: "/batik 1.jpg",
      alamat: "Jl. Kartini No. 12",
      wilayah: "Tegal Barat",
      rating: 4.6,
      jumlahReview: 84,
      jumlahProduk: 31,
    },
    {
      id: "5",
      nama: "Sanggar Batik Pesisir",
      foto: "/batik 1.jpg",
      alamat: "Jl. Pantai No. 5",
      wilayah: "Slawi",
      rating: 4.5,
      jumlahReview: 67,
      jumlahProduk: 28,
    },
    {
      id: "6",
      nama: "Batik Keraton Tegal",
      foto: "/batik 1.jpg",
      alamat: "Jl. Sultan Agung No. 33",
      wilayah: "Tegal Timur",
      rating: 4.8,
      jumlahReview: 112,
      jumlahProduk: 41,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/katalog?wilayah=${wilayah}&jenis=${jenisBatik}`);
  };

  return (
    <div className="bg-cream-100">
      {/* Hero Section — full 1 layar (viewport minus navbar) */}
      <section className="relative min-h-screen min-h-[100svh] min-h-[100dvh] flex flex-col justify-center px-4 py-[clamp(5.5rem,9vh,7rem)] overflow-hidden bg-[#f5ead8]">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <BatikPattern className="w-full h-full" />
        </div>

        <div className="max-w-7xl mx-auto w-full text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.75rem,5.6vw,4.6rem)] font-serif font-bold text-black mb-[clamp(1rem,2vh,1.25rem)] leading-[0.98]"
          >
            Cari Batik Tegalan Terbaik
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base font-serif font-semibold text-black/90 mb-[clamp(2rem,5vh,3rem)] max-w-3xl mx-auto leading-snug"
          >
            Temukan Sanggar batik pesisiran terbaik di Tegal dengan rekomendasi
            cerdas berdasarkan jarak dan jenis batik pilihanmu
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="group relative max-w-5xl mx-auto overflow-hidden rounded-[2rem] border border-white/30 bg-white/[0.10] p-4 shadow-[0_28px_70px_rgba(88,56,34,0.08),inset_0_1px_0_rgba(255,255,255,0.50)] ring-1 ring-brown-900/[0.03] backdrop-blur-[12px] sm:p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.05)_100%)]" />
            <div className="pointer-events-none absolute -left-16 top-1 h-28 w-[54%] rotate-[-10deg] rounded-full bg-white/35 blur-2xl transition-opacity duration-500 group-hover:opacity-95" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 text-left">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-black mb-2 pl-1 drop-shadow-[0_1px_0_rgba(255,255,255,0.70)]">
                  Wilayah
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                    size={19}
                  />
                  <select
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className={`w-full appearance-none pl-10 pr-9 py-3.5 border border-white/65 rounded-2xl focus:ring-2 focus:ring-brown-900/20 focus:border-white/90 outline-none bg-white/[0.72] backdrop-blur-xl text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_rgba(88,56,34,0.08)] transition ${
                      wilayah ? "text-black" : "text-black/80"
                    }`}
                  >
                    <option value="">Contoh: Tegal Barat</option>
                    <option value="tegal-barat">Tegal Barat</option>
                    <option value="tegal-timur">Tegal Timur</option>
                    <option value="tegal-selatan">Tegal Selatan</option>
                    <option value="margadana">Margadana</option>
                    <option value="slawi">Slawi</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/45 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex-1 text-left">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-black mb-2 pl-1 drop-shadow-[0_1px_0_rgba(255,255,255,0.70)]">
                  Jenis Batik
                </label>
                <div className="relative">
                  <MousePointer2
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                    size={19}
                  />
                  <select
                    value={jenisBatik}
                    onChange={(e) => setJenisBatik(e.target.value)}
                    className={`w-full appearance-none pl-10 pr-9 py-3.5 border border-white/65 rounded-2xl focus:ring-2 focus:ring-brown-900/20 focus:border-white/90 outline-none bg-white/[0.72] backdrop-blur-xl text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_rgba(88,56,34,0.08)] transition ${
                      jenisBatik ? "text-black" : "text-black/80"
                    }`}
                  >
                    <option value="">Pilih Jenis Batik</option>
                    <option value="flora">Flora</option>
                    <option value="fauna">Fauna</option>
                    <option value="geometris">Geometris</option>
                    <option value="benda">Benda</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/45 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-[#432f27] text-white rounded-2xl text-sm font-semibold hover:bg-black transition-colors shadow-[0_16px_30px_rgba(67,47,39,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] shrink-0"
              >
                <Search size={18} />
                Cari Sekarang
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Sanggar Rekomendasi */}
      <section
        id="sanggar-section"
        className="relative min-h-screen min-h-[100svh] min-h-[100dvh] flex flex-col justify-center scroll-mt-0 pt-[clamp(5rem,7vh,6rem)] pb-[clamp(3rem,5vh,4.5rem)] bg-[#f5ead8]"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <BatikPattern className="w-full h-full" variant="center" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12 px-4"
          >
            <h2 className="text-[1.75rem] sm:text-4xl font-serif font-bold text-brown-900">
              Sanggar Batik Rekomendasi
            </h2>
          </motion.div>

          <SanggarCarousel items={topSanggar} />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-center mt-12 sm:mt-14 px-4"
          >
            <button
              type="button"
              onClick={() => navigate("/katalog")}
              className="text-sm font-medium text-brown-800 hover:text-brown-900 transition-colors"
            >
              Lihat Semua
            </button>
          </motion.div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-16 px-4 bg-[#f5ead8]">
        <div className="max-w-4xl mx-auto">
          <div className="relative" style={{ paddingTop: "60px" }}>
            {/* Card */}
            <div
              className="relative rounded-3xl border border-orange-300/60"
              style={{
                background:
                  "linear-gradient(to right, #f0a854, #f5c98a, #f5ead8)",
                minHeight: "280px",
                overflow: "hidden",
              }}
            >
              {/* Inner card teks */}
              <div className="relative z-20 p-8 md:p-12">
                <div className="bg-[#f0a854] rounded-2xl p-8 max-w-sm text-center border border-orange-400/40">
                  <h3 className="text-xl font-bold text-brown-900 mb-3">
                    Promo Spesial Anniversary!
                  </h3>
                  <p className="text-brown-800/90 mb-6 text-sm leading-relaxed">
                    Dapatkan Promo Hingga 15% untuk pembelian minimal Rp
                    500.000. Promo hingga 1 Juli 2026, S&K Berlaku.
                  </p>
                  <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition text-sm">
                    Lihat Ketentuan
                  </button>
                </div>
              </div>
            </div>

            {/* Gambar batik — kepala nonggol ke atas, pucuk bawah terpotong */}
            <div
              className="hidden md:block absolute z-30"
              style={{
                top: "0px",
                right: "80px",
                width: "240px",
                bottom: "0px",
                clipPath: "inset(-9999px -9999px 0px -9999px)",
              }}
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/batik-badan.png"
                  alt="Promo Batik"
                  className="w-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section id="tentang-canting" className="py-16 px-4 bg-[#f5ead8]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-brown-900 mb-4">
            Tentang Canting
          </h2>
          <p className="text-brown-700 leading-relaxed">
            CANTING adalah platform digital yang menghadirkan pengalaman terbaik
            dalam menemukan dan membeli Batik Tegalan asli. Kami bekerja sama
            dengan sanggar-sanggar batik terpercaya di Tegal untuk memastikan
            kualitas dan keaslian setiap produk yang ditawarkan.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section id="katalog-section" className="py-16 px-4 bg-[#f5ead8]">
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
                onClick={() =>
                  navigate(`/katalog?kategori=${cat.name.toLowerCase()}`)
                }
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

      {/* Tentang Section */}
      <section id="tentang-section" className="py-20 px-4 bg-[#f5ead8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-sans font-black text-black mb-6 uppercase tracking-tight">
                Tentang Canting
              </h2>
              <p className="text-black/70 leading-relaxed mb-6 text-sm">
                CANTING adalah platform digital yang menghadirkan pengalaman
                terbaik dalam menemukan dan membeli Batik Tegalan asli. Kami
                bekerja sama dengan sanggar-sanggar batik terpercaya di Tegal
                untuk memastikan kualitas dan keaslian setiap produk yang
                ditawarkan.
              </p>
              <p className="text-black/70 leading-relaxed text-sm">
                Platform kami memudahkan kamu menemukan batik pesisiran terbaik
                berdasarkan wilayah, jenis motif, dan rekomendasi dari komunitas
                pecinta batik di seluruh Indonesia.
              </p>
            </div>
            <div className="bg-[#ddd8ce] rounded-3xl aspect-[4/3] w-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
