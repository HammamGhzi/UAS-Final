import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card } from '../UI/Card';

interface ProductCardProps {
  id: string;
  nama: string;
  harga: number;
  foto: string;
  rating: number;
  namaSanggar: string;
  wilayah: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  nama,
  harga,
  foto,
  rating,
  namaSanggar,
  wilayah,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/produk/${id}`}>
      <Card hover className="h-full">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={foto || '/placeholder-batik.jpg'}
            alt={nama}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-brown-900 mb-1 line-clamp-1">{nama}</h3>
          <p className="text-lime-600 font-bold mb-2">{formatPrice(harga)}</p>
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-brown-700">{rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{namaSanggar}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {wilayah}
          </div>
        </div>
      </Card>
    </Link>
  );
};