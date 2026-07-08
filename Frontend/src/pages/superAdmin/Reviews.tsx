import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import StarRating from "@/components/superAdmin/StarRating";
import { useReviewsAdmin, useDeleteReview, getReviewRating, type ManagedReview } from "./useReviewsAdmin";

const PAGE_SIZE = 5;
const RATING_OPTIONS = ["5", "4", "3", "2", "1"];

const SuperAdminReviewsPage = () => {
  const { data: reviewList = [], isPending, isError } = useReviewsAdmin();
  const deleteReview = useDeleteReview();

  const [query, setQuery] = useState("");
  const [produkFilter, setProdukFilter] = useState(""); // "" = semua produk, isinya nama produk
  const [ratingFilter, setRatingFilter] = useState(""); // "" = semua rating
  const [page, setPage] = useState(1);

  // Review di aplikasi ini cuma nempel ke Produk (bukan Sanggar langsung),
  // jadi dropdown "Jenis" diganti daftar nama produk yang punya review.
  const produkOptions = useMemo(() => {
    const names = reviewList.map((review) => review.product?.productName).filter(Boolean) as string[];
    return Array.from(new Set(names)).sort();
  }, [reviewList]);

  const filtered = useMemo(() => {
    return reviewList.filter((review) => {
      const q = query.toLowerCase();
      const matchQuery =
        review.reviewerName.toLowerCase().includes(q) ||
        (review.product?.productName ?? "").toLowerCase().includes(q) ||
        (review.comment ?? "").toLowerCase().includes(q);
      const matchProduk = produkFilter ? review.product?.productName === produkFilter : true;
      const matchRating = ratingFilter ? getReviewRating(review) === Number(ratingFilter) : true;
      return matchQuery && matchProduk && matchRating;
    });
  }, [reviewList, query, produkFilter, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (review: ManagedReview) => {
    const confirmed = window.confirm("Hapus review ini?");
    if (!confirmed) return;
    deleteReview.mutate(review.id);
  };

  if (isPending) return <p className="text-sm text-[#777777]">Memuat data review...</p>;
  if (isError) return <p className="text-sm text-red-500">Gagal mengambil data review.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Reviews</h1>
        <p className="mt-1 text-sm text-[#777777]">Moderasi ulasan dari seluruh produk.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-[16px] border border-[#c9c9c9] bg-white px-4">
          <Search size={20} className="text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari reviewer / produk / komentar..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Produk"
            value={produkFilter}
            options={produkOptions}
            onChange={(value) => {
              setProdukFilter(value);
              setPage(1);
            }}
            allLabel="Semua Produk"
          />
          <FilterDropdown
            label="Rating"
            value={ratingFilter}
            options={RATING_OPTIONS}
            onChange={(value) => {
              setRatingFilter(value);
              setPage(1);
            }}
            allLabel="Semua Rating"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {paginated.map((review) => (
          <article
            key={review.id}
            className="grid gap-4 rounded-[24px] border border-[#e2e2e2] bg-white p-5 md:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f0f0] text-sm font-bold text-[#777777]">
              {review.reviewerName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold text-[#333333]">{review.reviewerName}</h2>
                <span className="rounded-full bg-[#f5f5f5] px-3 py-0.5 text-xs font-semibold text-[#777777]">
                  Produk
                </span>
                <span className="text-xs text-[#8a8a8a]">&middot; {review.product?.productName ?? "-"}</span>
              </div>
              <p className="mt-2 text-sm text-[#666666]">{review.comment}</p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating rating={getReviewRating(review)} size={14} />
                <span className="text-xs text-[#a0a0a0]">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(review)}
              disabled={deleteReview.isPending}
              className="flex h-9 w-9 items-center justify-center self-start rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 disabled:opacity-60"
              aria-label="Hapus review"
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}

        {paginated.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-16 text-center text-[#777777]">
            Review tidak ditemukan.
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default SuperAdminReviewsPage;