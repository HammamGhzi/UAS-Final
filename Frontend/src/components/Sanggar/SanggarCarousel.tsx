import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SanggarCard } from './SanggarCard';

export interface SanggarItem {
  id: string;
  nama: string;
  foto: string;
  alamat: string;
  wilayah: string;
  rating: number;
  jumlahReview: number;
  jumlahProduk: number;
}

interface SanggarCarouselProps {
  items: SanggarItem[];
}

const cardMotion = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20px' },
  transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' as const },
});

export const SanggarCarousel = ({ items }: SanggarCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    // Kalau pointer down-nya di atas link/tombol (misal "Lihat Selengkapnya"),
    // JANGAN mulai drag sama sekali — biar klik/navigasinya jalan normal.
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      return;
    }

    setIsDragging(true);
    dragState.current = { startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    if (scrollRef.current?.hasPointerCapture(e.pointerId)) {
      scrollRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragState.current.moved = false;
  }, []);

  return (
    <div className="md:max-w-[1100px] md:mx-auto md:px-8">
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        className={`overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-hide touch-pan-x ${
          isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-6 px-6 md:px-0 md:gap-5">
          {items.map((sanggar, index) => (
            <motion.div
              key={sanggar.id}
              {...cardMotion(index)}
              className="snap-start shrink-0 w-[78vw] max-w-[300px] md:w-[calc((100%-2.5rem)/3)] md:max-w-none"
            >
              <SanggarCard {...sanggar} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};