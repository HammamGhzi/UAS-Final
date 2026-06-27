import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star, MapPin, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { MapComponent } from '../../components/Map/MapComponent';
import { produkApi, reviewApi } from '../../services/api';
import { ProductCard } from '../../components/Product/ProductCard';
import { SanggarCard } from '../../components/Sanggar/SanggarCard';
import { BatikPattern } from '../../assets/BatikPattern';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    nama: '',
    kualitas: 5,
    popularitas: 5,
    desain: 5,
    komentar: '',
  });

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => produkApi.getById(id!),
    {
      enabled: !!id,
    }
  );

  const { data: reviews } = useQuery(
    ['reviews', id],
    () => reviewApi.getByProduk(id!),
    {
      enabled: !!id,
    }
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await reviewApi.create({
        ...reviewData,
        produkId: id,
      });
      
      // Reset form
      setReviewData({
        nama: '',
        kualitas: 5,
        popularitas: 5,
        desain: 5,
        komentar: '',
      });
      
      // Refresh reviews
      await reviewApi.getByProduk(id);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-serif">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-serif text-red-500">Product not found</div>
      </div>
    );
  }

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

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.foto[0] || '/placeholder-batik.jpg'}
                alt={product.nama}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.foto.map((img, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${product.nama} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">
              {product.nama}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-brown-700">
                ({product.jumlahReview} ulasan)
              </span>
            </div>
            <p className="text-2xl font-bold text-lime-600 mb-6">
              {formatPrice(product.harga)}
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-brown-800 font-medium mb-1">Kategori</h3>
                <p className="text-brown-700">{product.kategori}</p>
              </div>
              <div>
                <h3 className="text-brown-800 font-medium mb-1">Motif</h3>
                <p className="text-brown-700">{product.motif}</p>
              </div>
              <div>
                <h3 className="text-brown-800 font-medium mb-1">Jenis Kain</h3>
                <p className="text-brown-700">{product.jenisKain}</p>
              </div>
              <div>
                <h3 className="text-brown-800 font-medium mb-1">Teknik</h3>
                <p className="text-brown-700">{product.teknik}</p>
              </div>
            </div>

            {/* Sanggar Info */}
            <Card className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={product.sanggar?.foto || '/placeholder-sanggar.jpg'}
                    alt={product.sanggar?.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-brown-900 mb-1">
                    {product.sanggar?.nama}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin size={14} />
                    {product.sanggar?.alamat}, {product.sanggar?.wilayah}
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={() => navigate(`/sanggar/${product.sanggar?.id}`)}
                  >
                    Lihat Sanggar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-brown-900 mb-4">
                Ulasan
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-brown-900">
                            {review.nama}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span>{new Date(review.tanggal).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < Math.floor(
                                  (review.kualitas + review.popularitas + review.desain) / 3
                                )
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-brown-700 mb-2">{review.komentar}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Kualitas</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${
                                  i < review.kualitas
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Popularitas</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${
                                  i < review.popularitas
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Desain</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${
                                  i < review.desain
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brown-600">
                  Belum ada ulasan untuk produk ini
                </div>
              )}

              {/* Review Form */}
              <div className="mt-8">
                <h2 className="text-2xl font-serif font-bold text-brown-900 mb-4">
                  Tambah Ulasan
                </h2>
                <form onSubmit={handleSubmitReview}>
                  <Input
                    label="Nama"
                    value={reviewData.nama}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, nama: e.target.value })
                    }
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-800 mb-1">
                        Kualitas
                      </label>
                      <select
                        value={reviewData.kualitas}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            kualitas: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} bintang
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-800 mb-1">
                        Popularitas
                      </label>
                      <select
                        value={reviewData.popularitas}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            popularitas: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} bintang
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-800 mb-1">
                        Desain
                      </label>
                      <select
                        value={reviewData.desain}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            desain: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} bintang
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Input
                    label="Komentar"
                    value={reviewData.komentar}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, komentar: e.target.value })
                    }
                    required
                    as="textarea"
                    rows={4}
                    className="mt-4"
                  />
                  <Button type="submit" className="mt-4 w-full">
                    Kirim Ulasan
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-brown-900 mb-6">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.sanggar?.produk
              ?.filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  nama={relatedProduct.nama}
                  harga={relatedProduct.harga}
                  foto={relatedProduct.foto[0]}
                  rating={relatedProduct.rating}
                  namaSanggar={product.sanggar?.nama || ''}
                  wilayah={product.sanggar?.wilayah || ''}
                />
              ))}
          </div>
        </div>

        {/* Map Section */}
        {product.sanggar && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-brown-900 mb-4">
              Lokasi Sanggar
            </h2>
            <Card>
              <MapComponent
                latitude={product.sanggar.latitude}
                longitude={product.sanggar.longitude}
                nama={product.sanggar.nama}
                alamat={product.sanggar.alamat}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;