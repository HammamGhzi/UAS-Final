import { useLocation } from 'react-router-dom';
import { Star, MapPin, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { BatikPattern } from '../../assets/BatikPattern';

const RecommendationResult = () => {
  const location = useLocation();
  const { state } = location;
  const results = [
    {
      rank: 1,
      score: 0.892,
      product: "Batik Mahkota",
      sanggar: "Sanggar Srikandi",
      jarak: 2.1,
      harga: 250000,
    },
    {
      rank: 2,
      score: 0.856,
      product: "Batik Bunga Mawar",
      sanggar: "Rumah Batik Tegalan",
      jarak: 3.4,
      harga: 320000,
    },
    {
      rank: 3,
      score: 0.789,
      product: "Batik Itik Pajangan",
      sanggar: "Batik Nusantara",
      jarak: 1.8,
      harga: 280000,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <BatikPattern className="w-full h-full text-brown-900" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8 text-brown-600">
          <button 
            onClick={() => window.history.back()}
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
            Berikut adalah rekomendasi batik berdasarkan preferensi Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {results.map((result, index) => (
            <motion.div
              key={result.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="text-center p-6">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 bg-lime-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center">
                      #{result.rank}
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={`/batik-result-${index + 1}.jpg`}
                        alt={result.product}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-brown-900 mb-2">
                    {result.product}
                  </h2>
                  <p className="text-lime-600 font-bold text-xl mb-4">
                    {formatPrice(result.harga)}
                  </p>
                  
                  <div className="text-left mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-400" />
                      <span className="text-brown-800 font-medium">Score TOPSIS</span>
                    </div>
                    <div className="text-3xl font-bold text-brown-900 mb-4">
                      {result.score.toFixed(3)}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-lime-600" />
                      <span className="text-brown-800 font-medium">Jarak</span>
                    </div>
                    <p className="text-brown-900 text-xl mb-4">
                      {result.jarak} km
                    </p>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => window.history.back()}
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
            onClick={() => window.history.back()}
          >
            Cari Rekomendasi Lain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResult;