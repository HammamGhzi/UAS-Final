import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Produk } from '../../types';

interface ProductCardHomeProps {
  produk: Produk;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

export const ProductCardHome: React.FC<ProductCardHomeProps> = ({ produk }) => {
  return (
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
};