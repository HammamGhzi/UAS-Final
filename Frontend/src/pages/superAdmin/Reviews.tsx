import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import StarRating from "@/components/superAdmin/StarRating";
import { reviewList as initialReviewList, type SuperAdminReview } from "./data";

const PAGE_SIZE = 5;

const JENIS_OPTIONS = ["Produk", "Sanggar"];
const RATING_OPTIONS = ["5", "4", "3", "2", "1"];

const SuperAdminReviewsPage = () => {
  // TODO(backend): ganti useState ini dengan hasil GET /super-admin/reviews
  const [reviewList, setReviewList] = useState<SuperAdminReview[]>(initialReviewList);
  const [query, setQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState(""); // bebas: filter berdasarkan jenis target
  const [ratingFilter, setRatingFilter] = useState(""); // bebas: filter berdasarkan rating
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return reviewList.filter((review) => {
      const matchQuery =
        review.nama.toLowerCase().includes(query.toLowerCase()) ||
        review.target.toLowerCase().includes(query.toLowerCase());
      const matchJenis = jenisFilter ? review.jenis === jenisFilter : true;
      const matchRating = ratingFilter ? review.rating === Number(ratingFilter) : true;
      return matchQuery && matchJenis && matchRating;
    });
  }, [reviewList, query, jenisFilter, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (review: SuperAdminReview) => {
    const confirmed = window.confirm("Hapus review ini?");
    if (!confirmed) return;
    // TODO(backend): panggil DELETE /super-admin/reviews/:id lalu refetch
    setReviewList((prev) => prev.filter((item) => item.id !== review.id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Reviews</h1>
        <p className="mt-1 text-sm text-[#777777]">Moderasi ulasan dari seluruh produk dan sanggar.</p>
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
            placeholder="Cari reviewer / target..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Jenis"
            value={jenisFilter}
            options={JENIS_OPTIONS}
            onChange={(value) => {
              setJenisFilter(value);
              setPage(1);
            }}
            allLabel="Semua Jenis"
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
            <img src={review.avatar} alt={review.nama} className="h-12 w-12 rounded-full" />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold text-[#333333]">{review.nama}</h2>
                <span className="rounded-full bg-[#f5f5f5] px-3 py-0.5 text-xs font-semibold text-[#777777]">
                  {review.jenis}
                </span>
                <span className="text-xs text-[#8a8a8a]">&middot; {review.target}</span>
              </div>
              <p className="mt-2 text-sm text-[#666666]">{review.komentar}</p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating rating={review.rating} size={14} />
                <span className="text-xs text-[#a0a0a0]">
                  {new Date(review.tanggal).toLocaleDateString("id-ID", {
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
              className="flex h-9 w-9 items-center justify-center self-start rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50"
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