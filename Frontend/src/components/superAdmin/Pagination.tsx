import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm font-semibold text-[#8a8a8a] transition hover:text-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        PREV
      </button>

      <div className="flex items-center gap-5">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`relative pb-1 text-sm font-semibold transition ${
              page === currentPage
                ? "text-[#3b82f6] after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-[#3b82f6]"
                : "text-[#9a9a9a] hover:text-[#4b4b4b]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm font-semibold text-[#8a8a8a] transition hover:text-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
      >
        NEXT
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;