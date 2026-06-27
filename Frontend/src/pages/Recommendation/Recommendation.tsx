import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Check, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { Select } from '../../components/UI/Select';
import { BatikPattern } from '../../assets/BatikPattern';

const Recommendation = () => {
  const navigate = useNavigate();
  const [prioritas, setPrioritas] = useState({
    jarak: true,
    harga: true,
    kualitas: true,
  });
  const [jenisBatik, setJenisBatik] = useState({
    flora: false,
    fauna: false,
    geometris: false,
    benda: false,
  });
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocationLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocationLoaded(true);
        }
      );
    } else {
      setIsLocationLoaded(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for API
    const params = {
      prioritas: Object.keys(prioritas).filter(key => prioritas[key as keyof typeof prioritas]),
      jenisBatik: Object.keys(jenisBatik).filter(key => jenisBatik[key as keyof typeof jenisBatik]),
      latitude: location.latitude,
      longitude: location.longitude,
    };

    navigate('/rekomendasi/hasil', { state: params });
  };

  const togglePrioritas = (key: keyof typeof prioritas) => {
    setPrioritas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleJenisBatik = (key: keyof typeof jenisBatik) => {
    setJenisBatik(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <BatikPattern className="w-full h-full text-brown-900" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
            Cari Rekomendasi
          </h1>
          <p className="text-brown-700">
            Temukan batik terbaik berdasarkan preferensi Anda
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch}>
            {/* Prioritas Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brown-900 mb-4">
                Prioritas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="jarak"
                    checked={prioritas.jarak}
                    onChange={() => togglePrioritas('jarak')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="jarak" className="text-brown-800 font-medium">
                    Jarak
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="harga"
                    checked={prioritas.harga}
                    onChange={() => togglePrioritas('harga')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="harga" className="text-brown-800 font-medium">
                    Harga
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="kualitas"
                    checked={prioritas.kualitas}
                    onChange={() => togglePrioritas('kualitas')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="kualitas" className="text-brown-800 font-medium">
                    Kualitas
                  </label>
                </div>
              </div>
            </div>

            {/* Jenis Batik Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brown-900 mb-4">
                Jenis Batik
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flora"
                    checked={jenisBatik.flora}
                    onChange={() => toggleJenisBatik('flora')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="flora" className="text-brown-800 font-medium">
                    Flora
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fauna"
                    checked={jenisBatik.fauna}
                    onChange={() => toggleJenisBatik('fauna')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="fauna" className="text-brown-800 font-medium">
                    Fauna
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="geometris"
                    checked={jenisBatik.geometris}
                    onChange={() => toggleJenisBatik('geometris')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="geometris" className="text-brown-800 font-medium">
                    Geometris
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="benda"
                    checked={jenisBatik.benda}
                    onChange={() => toggleJenisBatik('benda')}
                    className="h-5 w-5 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="benda" className="text-brown-800 font-medium">
                    Benda
                  </label>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brown-900 mb-4">
                Lokasi
              </h2>
              <div className="relative">
                <MapPin 
                  size={24} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-lime-600" 
                />
                <div className="pl-12 py-3 bg-cream-50 border border-cream-300 rounded-lg">
                  {isLocationLoaded ? (
                    location.latitude !== 0 ? (
                      <p className="text-brown-700">
                        Lokasi saat ini: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    ) : (
                      <p className="text-brown-700">
                        Lokasi tidak tersedia. Gunakan tombol di bawah untuk mendapatkan lokasi.
                      </p>
                    )
                  ) : (
                    <p className="text-brown-700">Mengambil lokasi...</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              className="w-full"
            >
              Cari Rekomendasi
              <ChevronRight size={20} />
            </Button>
          </form>
        </Card>

        <div className="text-center text-brown-600">
          <p className="flex items-center justify-center gap-2">
            <Star size={16} className="text-yellow-400" />
            Rekomendasi menggunakan metode TOPSIS berdasarkan preferensi Anda
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;