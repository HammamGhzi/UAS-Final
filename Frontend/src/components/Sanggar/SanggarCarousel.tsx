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
    scrollRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const featured = items.slice(0, 3);

  return (
    <>
      {/* Desktop — 3 card grid persis Figma */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:max-w-[1100px] md:mx-auto md:px-8">
        {featured.map((sanggar, index) => (
          <motion.div key={sanggar.id} {...cardMotion(index)}>
            <SanggarCard {...sanggar} />
          </motion.div>
        ))}
      </div>

      {/* Mobile — scroll horizontal */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
          className={`overflow-x-auto pb-2 snap-x snap-proximity scroll-smooth scrollbar-hide touch-pan-x ${
            isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-6 px-6">
            {featured.map((sanggar, index) => (
              <motion.div
                key={sanggar.id}
                {...cardMotion(index)}
                className="snap-center shrink-0 w-[78vw] max-w-[300px]"
              >
                <SanggarCard {...sanggar} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
