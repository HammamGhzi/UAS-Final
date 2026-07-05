import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import { produkList as initialProdukList, sanggarList, type SuperAdminProduk } from "./data";

const PAGE_SIZE = 5;

const sanggarNames = sanggarList.map((sanggar) => sanggar.nama);

const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

const SuperAdminProdukPage = () => {
  // TODO(backend): ganti useState ini dengan hasil GET /super-admin/produk
  const [produkList, setProdukList] = useState<SuperAdminProduk[]>(initialProdukList);
  const [query, setQuery] = useState("");
  const [sanggarFilter, setSanggarFilter] = useState(""); // "" = semua sanggar
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return produkList.filter((produk) => {
      const matchQuery = produk.nama.toLowerCase().includes(query.toLowerCase());
      const matchSanggar = sanggarFilter ? produk.sanggarNama === sanggarFilter : true;
      return matchQuery && matchSanggar;
    });
  }, [produkList, query, sanggarFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (produk: SuperAdminProduk) => {
    const confirmed = window.confirm(`Hapus produk "${produk.nama}"?`);
    if (!confirmed) return;
    // TODO(backend): panggil DELETE /super-admin/produk/:id lalu refetch
    setProdukList((prev) => prev.filter((item) => item.id !== produk.id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Produk</h1>
        <p className="mt-1 text-sm text-[#777777]">Pantau seluruh produk dari semua sanggar.</p>
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
            placeholder="Cari nama produk..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        <FilterDropdown
          label="Sanggar"
          value={sanggarFilter}
          options={sanggarNames}
          onChange={(value) => {
            setSanggarFilter(value);
            setPage(1);
          }}
          allLabel="Semua Sanggar"
        />
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[#e2e2e2] bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#eeeeee] text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">
              <th className="px-6 py-4">Gambar</th>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Sanggar</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((produk) => (
              <tr key={produk.id} className="border-b border-[#f2f2f2] last:border-0">
                <td className="px-6 py-4">
                  <img
                    src={produk.foto}
                    alt={produk.nama}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[#333333]">{produk.nama}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.sanggarNama}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.kategori}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{formatRupiah(produk.harga)}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.stok}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(produk)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50"
                    aria-label="Hapus produk"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#777777]">
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default SuperAdminProdukPage;