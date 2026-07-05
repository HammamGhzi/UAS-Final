import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import StarRating from "@/components/superAdmin/StarRating";
import { sanggarList as initialSanggarList, WILAYAH_LIST, type SuperAdminSanggar } from "./data";

const PAGE_SIZE = 6;

const SuperAdminSanggarPage = () => {
  // TODO(backend): ganti useState ini dengan hasil GET /super-admin/sanggar
  const [sanggarList, setSanggarList] = useState<SuperAdminSanggar[]>(initialSanggarList);
  const [query, setQuery] = useState("");
  const [wilayah, setWilayah] = useState(""); // "" = semua wilayah
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return sanggarList.filter((sanggar) => {
      const matchQuery = sanggar.nama.toLowerCase().includes(query.toLowerCase());
      const matchWilayah = wilayah ? sanggar.wilayah === wilayah : true;
      return matchQuery && matchWilayah;
    });
  }, [sanggarList, query, wilayah]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handleDelete = (sanggar: SuperAdminSanggar) => {
    const confirmed = window.confirm(`Hapus "${sanggar.nama}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;
    // TODO(backend): panggil DELETE /super-admin/sanggar/:id lalu refetch
    setSanggarList((prev) => prev.filter((item) => item.id !== sanggar.id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Sanggar</h1>
        <p className="mt-1 text-sm text-[#777777]">Kelola seluruh sanggar batik yang terdaftar.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-[16px] border border-[#c9c9c9] bg-white px-4">
          <Search size={20} className="text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari nama sanggar..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        <FilterDropdown
          label="Wilayah"
          value={wilayah}
          options={WILAYAH_LIST}
          onChange={handleFilterChange(setWilayah)}
          allLabel="Semua Wilayah"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((sanggar) => (
          <article
            key={sanggar.id}
            className="rounded-[24px] border border-[#e2e2e2] bg-white p-5"
          >
            <div className="h-[220px] w-full overflow-hidden rounded-[18px]">
              <img
                src={sanggar.foto}
                alt={sanggar.nama}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-extrabold text-[#2f2f2f]">{sanggar.nama}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">
                {sanggar.wilayah}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <StarRating rating={sanggar.rating} count={sanggar.jumlahReview} />
                <span className="text-xs text-[#8a8a8a]">{sanggar.totalProduk} produk</span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(sanggar)}
                className="mt-4 w-full rounded-full bg-[#ff6b6b] py-2.5 text-sm font-bold text-white transition hover:bg-[#e85555]"
              >
                Hapus Sanggar
              </button>
            </div>
          </article>
        ))}

        {paginated.length === 0 && (
          <div className="col-span-full rounded-[24px] border border-dashed border-[#d7d7d7] py-16 text-center text-[#777777]">
            Sanggar tidak ditemukan.
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default SuperAdminSanggarPage;