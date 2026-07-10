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
    <Link to={`/produk/${produk.id}`} className="block h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_4px_18px_rgba(67,47,39,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(67,47,39,0.16)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-brown-100">
          <img
            src={produk.foto[0]}
            alt={produk.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#432f27] shadow-sm backdrop-blur-sm">
            {produk.kategori}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-serif text-base font-bold leading-snug text-brown-900 line-clamp-1">
            {produk.nama}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-[#fdf3e0] px-2 py-0.5">
              <Star size={12} className="fill-[#b08d28] text-[#b08d28]" />
              <span className="text-xs font-semibold text-[#8a6c1f]">
                {produk.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-brown-500">
              ({produk.jumlahReview} ulasan)
            </span>
          </div>

          <p className="mt-auto pt-1 text-lg font-extrabold text-[#432f27]">
            {formatPrice(produk.harga)}
          </p>
        </div>
      </div>
    </Link>
  );
};