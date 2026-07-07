import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Loader2,
  Lock,
  MessageSquareText,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  fieldLabels,
  getMissingSanggarFields,
  getStoredSanggarDraft,
  isSanggarComplete,
} from "./sanggarDraft";
import { getCategoryName } from "@/pages/adminSanggar/productStore";
import { useProducts } from "./useProducts";
import { getAverageRating, getProductAverageRating } from "./reviewStore";
import { useClearReviews, useReviews, useSeedSampleReviews } from "./useReviews";

const AdminSanggarReviews = () => {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const sanggarDraft = useMemo(() => getStoredSanggarDraft(), []);
  const complete = isSanggarComplete(sanggarDraft);
  const missingFields = getMissingSanggarFields(sanggarDraft);

  const { data: products = [] } = useProducts();
  const { data: reviews = [], isLoading } = useReviews();
  const seedSample = useSeedSampleReviews();
  const clearReviews = useClearReviews();

  const filteredReviews = reviews
    .filter((review) => (productFilter ? review.productId === Number(productFilter) : true))
    .filter((review) => {
      const product = products.find((item) => item.id === review.productId);
      const haystack = `${review.reviewerName} ${product?.productName ?? ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const overallAverage =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + getAverageRating(review), 0) / reviews.length
      : 0;

  const ratedProductCount = new Set(reviews.map((review) => review.productId)).size;

  const productsWithoutReview = products.filter(
    (product) => !reviews.some((review) => review.productId === product.id)
  );

  const handleSeed = () => {
    seedSample.mutate(products);
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Hapus semua data ulasan contoh yang tersimpan di perangkat ini?"
    );
    if (confirmed) clearReviews.mutate();
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Total Ulasan" value={complete ? String(reviews.length) : "0"} />
        <InfoCard
          title="Rata-rata Rating"
          value={complete && reviews.length > 0 ? overallAverage.toFixed(1) : "-"}
        />
        <InfoCard title="Produk Ternilai" value={complete ? String(ratedProductCount) : "0"} />
      </section>

      {!complete && (
        <section className="rounded-[28px] border border-[#dedede] bg-white px-8 py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                <Lock size={27} />
              </div>
              <div>
                <h1 className="text-[26px] font-extrabold text-[#2f2f2f]">
                  Riwayat rating belum bisa dilihat
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#747474]">
                  Lengkapi data wajib sanggar terlebih dahulu. Data yang belum lengkap:{" "}
                  <span className="font-bold text-[#333333]">
                    {missingFields.map((field) => fieldLabels[field]).join(", ")}
                  </span>
                  .
                </p>
              </div>
            </div>
            <Link
              to="/admin-sanggar/settings"
              className="inline-flex items-center justify-center rounded-full bg-[#252525] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Lengkapi Data
            </Link>
          </div>
        </section>
      )}

      {complete && (
        <section className="rounded-[28px] border border-[#dedede] bg-white px-8 py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Riwayat Rating</h1>
              <p className="mt-1 text-sm text-[#777777]">
                Ulasan dari pembeli untuk tiap produk: kualitas, popularitas, dan desain.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleSeed}
                disabled={products.length === 0 || productsWithoutReview.length === 0 || seedSample.isPending}
                className="rounded-full border border-[#d6d6d6] bg-white px-5 text-[#3e3e3e] hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {seedSample.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Database size={16} />
                )}
                Muat Contoh Data
              </Button>

              {reviews.length > 0 && (
                <Button
                  type="button"
                  onClick={handleClear}
                  disabled={clearReviews.isPending}
                  className="rounded-full border border-[#d6d6d6] bg-white px-5 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Hapus Contoh Data
                </Button>
              )}
            </div>
          </div>

          {products.length === 0 && (
            <p className="mt-4 text-sm font-medium text-[#9b5a00]">
              Belum ada produk. Tambahkan produk dulu di menu{" "}
              <Link to="/admin-sanggar/products" className="underline">
                Produk
              </Link>{" "}
              sebelum memuat contoh ulasan.
            </p>
          )}

          <p className="mt-4 rounded-2xl border border-[#ffe1b3] bg-[#fff8ec] px-5 py-3 text-xs leading-relaxed text-[#9b5a00]">
            Data ulasan di halaman ini masih tersimpan lokal di perangkat ini (belum konek ke
            backend), sama seperti data produk. "Muat Contoh Data" cuma buat simulasi tampilan.
          </p>

          <div className="mt-6 flex h-[58px] items-center gap-3 rounded-[22px] border border-[#c9c9c9] bg-[#f7f8fd] px-5">
            <Search size={22} className="text-[#8a8a8a]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama pembeli atau produk..."
              className="h-full flex-1 bg-transparent text-[17px] outline-none placeholder:text-[#8a8a8a]"
            />
          </div>

          {products.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                active={productFilter === ""}
                label="Semua Produk"
                onClick={() => setProductFilter("")}
              />
              {products.map((product) => (
                <FilterChip
                  key={product.id}
                  active={productFilter === String(product.id)}
                  label={product.productName}
                  onClick={() => setProductFilter(String(product.id))}
                />
              ))}
            </div>
          )}

          <div className="mt-7 grid gap-4">
            {isLoading && (
              <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-12 text-center text-[#777777]">
                Memuat ulasan...
              </div>
            )}

            {!isLoading &&
              filteredReviews.map((review) => {
                const product = products.find((item) => item.id === review.productId);
                const average = getAverageRating(review);

                return (
                  <article
                    key={review.id}
                    className="rounded-[24px] border border-[#e2e2e2] bg-white p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageSquareText size={18} className="text-[#ff9800]" />
                          <h2 className="text-lg font-extrabold text-[#333333]">
                            {review.reviewerName}
                          </h2>
                        </div>
                        <p className="mt-1 text-sm text-[#777777]">
                          {product ? product.productName : "Produk sudah dihapus"}
                          {product && ` - ${getCategoryName(product.categoryId)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full bg-[#fff4df] px-4 py-1.5 text-sm font-bold text-[#ff9800]">
                        <Star size={15} className="fill-[#ff9800]" />
                        {average.toFixed(1)}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#555555]">
                      {review.comment}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#eeeeee] pt-4">
                      <ScoreItem label="Kualitas" value={review.quality} />
                      <ScoreItem label="Popularitas" value={review.popularity} />
                      <ScoreItem label="Desain" value={review.design} />
                    </div>

                    <p className="mt-3 text-xs text-[#999999]">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(review.createdAt))}
                    </p>
                  </article>
                );
              })}

            {!isLoading && filteredReviews.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-12 text-center text-[#777777]">
                {reviews.length === 0
                  ? 'Belum ada ulasan. Klik "Muat Contoh Data" untuk simulasi tampilan.'
                  : "Ulasan tidak ditemukan."}
              </div>
            )}
          </div>

          {products.length > 0 && ratedProductCount > 0 && (
            <div className="mt-8 border-t border-[#eeeeee] pt-6">
              <h3 className="text-lg font-extrabold text-[#333333]">Rata-rata per Produk</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {products
                  .filter((product) => reviews.some((review) => review.productId === product.id))
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl bg-[#f7f8fa] px-5 py-3.5"
                    >
                      <span className="text-sm font-bold text-[#333333]">
                        {product.productName}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-[#ff9800]">
                        <Star size={14} className="fill-[#ff9800]" />
                        {getProductAverageRating(product.id, reviews).toFixed(1)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="h-[146px] rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
    <p className="text-sm font-bold text-[#777777]">{title}</p>
    <p className="mt-5 text-[34px] font-extrabold text-[#262626]">{value}</p>
  </div>
);

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
      active
        ? "bg-[#252525] text-white"
        : "bg-[#f0f0f0] text-[#555555] hover:bg-[#e4e4e4]"
    }`}
  >
    {label}
  </button>
);

const ScoreItem = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999999]">{label}</p>
    <p className="mt-1 text-base font-extrabold text-[#333333]">{value}/5</p>
  </div>
);

export default AdminSanggarReviews;