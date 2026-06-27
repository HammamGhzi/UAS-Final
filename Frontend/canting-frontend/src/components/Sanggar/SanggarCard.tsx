import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SanggarCardProps {
  id: string;
  nama: string;
  foto: string;
  alamat?: string;
  wilayah?: string;
  rating: number;
  jumlahReview: number;
  jumlahProduk?: number;
}

const accent = 'text-[#b08d28]';

export const SanggarCard: React.FC<SanggarCardProps> = ({
  id,
  nama,
  foto,
  rating,
  jumlahReview,
}) => {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group flex flex-col h-full w-full"
    >
      <div className="overflow-hidden rounded-2xl bg-[#e5e0d4]">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={foto || '/batik 1.jpg'}
            alt={nama}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="pt-4 flex flex-col flex-1">
        <h3 className="font-sans font-bold text-brown-900 text-[18px] leading-snug mb-3">
          {nama}
        </h3>

        <div className={`flex items-center justify-between gap-3 mb-3 text-[13px] ${accent}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={14} className="shrink-0" strokeWidth={1.75} />
            <span className="truncate font-medium">TO BE DECIDED</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <Star size={14} className="fill-[#eab308] text-[#eab308]" />
            <span>{rating.toFixed(1)}</span>
            <span>({jumlahReview})</span>
          </div>
        </div>

        <Link
          to={`/sanggar/${id}`}
          className={`inline-flex items-center gap-1 text-[13px] font-medium ${accent} hover:text-[#8a6f1f] transition-colors mt-auto w-fit`}
        >
          Lihat Selengkapnya
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.article>
  );
};
