import { Link } from 'react-router-dom';
import { Star, MapPin, Package, ArrowRight } from 'lucide-react';

interface SanggarCardProps {
  id: string;
  nama: string;
  foto: string;
  alamat: string;
  wilayah: string;
  rating: number;
  jumlahReview: number;
  jumlahProduk: number;
}

export const SanggarCard: React.FC<SanggarCardProps> = ({
  id,
  nama,
  foto,
  alamat,
  wilayah,
  rating,
  jumlahReview,
  jumlahProduk,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 h-full flex flex-col">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={foto || '/placeholder-sanggar.jpg'}
          alt={nama}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-brown-900 mb-3 text-base">{nama}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded text-xs text-brown-600">
            <Package size={11} />
            <span>TO BE DECIDED</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-brown-700">{rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({jumlahReview})</span>
          </div>
        </div>
        <div className="flex items-start gap-1 text-sm text-gray-500 mb-1">
          <MapPin size={13} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{alamat}, {wilayah}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <Package size={13} />
          <span>{jumlahProduk} produk</span>
        </div>
        <Link
          to={`/sanggar/${id}`}
          className="mt-auto flex items-center gap-1 text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors"
        >
          Lihat Selengkapnya <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};