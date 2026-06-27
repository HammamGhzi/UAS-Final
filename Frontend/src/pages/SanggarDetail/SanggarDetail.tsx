import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { MapComponent } from '../../components/Map/MapComponent';
import { sanggarApi } from '../../services/api';
import { ProductCard } from '../../components/Product/ProductCard';
import { BatikPattern } from '../../assets/BatikPattern';

const SanggarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sanggar, isLoading, error } = useQuery(
    ['sanggar', id],
    () => sanggarApi.getById(id!),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-serif">Loading...</div>
      </div>
    );
  }

  if (error || !sanggar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-serif text-red-500">Sanggar not found</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <BatikPattern className="w-full h-full text-brown-900" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-brown-600">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-brown-900"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>
        </div>

        {/* Sanggar Header */}
        <div className="bg-cream-50 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={sanggar.foto || '/placeholder-sanggar.jpg'}
                  alt={sanggar.nama}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
                {sanggar.nama}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(sanggar.rating) ? '#f59e0b' : '#e5e7eb'}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 17.27L18.18 20.14l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 3.87L5.82 20.14z" />
                  </svg>
                ))}
                <span className="text-brown-700">
                  ({sanggar.jumlahReview} ulasan)
                </span>
              </div>
              <p className="text-brown-700 mb-4 text-lg leading-relaxed">
                {sanggar.deskripsi}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-lime-600" />
                  <div>
                    <h3 className="font-medium text-brown-800">Alamat</h3>
                    <p className="text-brown-700">{sanggar.alamat}, {sanggar.wilayah}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-lime-600" />
                  <div>
                    <h3 className="font-medium text-brown-800">Kontak</h3>
                    <p className="text-brown-700">{sanggar.noHp}</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="w-full md:w-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sanggar.produk?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                nama={product.nama}
                harga={product.harga}
                foto={product.foto[0]}
                rating={product.rating}
                namaSanggar={sanggar.nama}
                wilayah={sanggar.wilayah}
              />
            ))}
          </div>
          {sanggar.produk?.length === 0 && (
            <div className="text-center py-12 text-brown-600">
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