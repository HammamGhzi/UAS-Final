import { useLocation, useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { BatikPattern } from '../../assets/BatikPattern';

// Bentuk data persis seperti yang dibalikin getTopsisResultsWithSanggar di backend
type TopsisResult = {
  sessionId: string;
  ranking: number;
  productId: number;
  productName: string;
  price: number | string;
  image: string | null;
  nilai_preferensi: number | string;
  jarak: number | string;
  sanggarName: string;
  sanggarId: number;
};

const RecommendationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { results?: TopsisResult[]; sessionId?: string } | null;
  const results = state?.results ?? [];

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  // Kalau halaman ini diakses langsung tanpa lewat pencarian (state kosong),
  // arahkan user balik ke halaman rekomendasi supaya tidak lihat halaman kosong.
  if (!state || results.length === 0) {
    return (
      <div className="relative">
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <BatikPattern className="w-full h-full text-brown-900" />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-serif font-bold text-brown-900 mb-3">
            Belum ada hasil rekomendasi
          </h1>
          <p className="text-brown-700 mb-8">
            Silakan isi preferensi kriteria terlebih dahulu di halaman Rekomendasi.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/rekomendasi')}>
            Ke Halaman Rekomendasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <BatikPattern className="w-full h-full text-brown-900" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8 text-brown-600">
          <button
            onClick={() => navigate('/rekomendasi')}
            className="flex items-center gap-1 hover:text-brown-900"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
            Hasil Rekomendasi
          </h1>
          <p className="text-brown-700">
            Ranking berikut dihitung memakai metode TOPSIS berdasarkan bobot kriteria yang kamu pilih
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {results.map((result, index) => (
            <motion.div
              key={result.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="text-center p-6">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 bg-lime-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center">
                      #{result.ranking}
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={result.image || '/batik 1.jpg'}
                        alt={result.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-brown-900 mb-1">
                    {result.productName}
                  </h2>
                  <p className="flex items-center justify-center gap-1 text-sm text-brown-600 mb-3">
                    <Store size={14} />
                    {result.sanggarName}
                  </p>
                  <p className="text-lime-600 font-bold text-xl mb-4">
                    {formatPrice(result.price)}
                  </p>

                  <div className="text-left mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-400" />
                      <span className="text-brown-800 font-medium">Skor TOPSIS</span>
                    </div>
                    <div className="text-3xl font-bold text-brown-900 mb-4">
                      {Number(result.nilai_preferensi).toFixed(3)}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-lime-600" />
                      <span className="text-brown-800 font-medium">Jarak</span>
                    </div>
                    <p className="text-brown-900 text-xl mb-4">
                      {Number(result.jarak).toFixed(1)} km
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate(`/produk/${result.productId}`)}
                  >
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/rekomendasi')}
          >
            Cari Rekomendasi Lain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResult;