import { useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import { useSanggars } from "./useSanggar";
import { useProdukList, useUpdateProduk, useDeleteProduk, type ManagedProduct } from "./useProdukAdmin";
import ProdukEditModal from "./ProdukEditModal";
import type { ProdukEditFormValues } from "./produkEditStore";

const PAGE_SIZE = 5;

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const toFormValues = (produk: ManagedProduct): ProdukEditFormValues => ({
  productName: produk.productName,
  categoryId: String(produk.categoryId),
  price: String(produk.price),
  stock: String(produk.stock),
  description: produk.description ?? "",
  image: produk.image ?? "",
});

const SuperAdminProdukPage = () => {
  const { data: produkList = [], isPending, isError } = useProdukList();
  const { data: sanggarList = [] } = useSanggars();
  const updateProduk = useUpdateProduk();
  const deleteProduk = useDeleteProduk();

  const [query, setQuery] = useState("");
  const [sanggarFilter, setSanggarFilter] = useState(""); // "" = semua sanggar, isinya nama sanggar
  const [page, setPage] = useState(1);
  const [editingProduk, setEditingProduk] = useState<ManagedProduct | null>(null);

  const sanggarNames = useMemo(() => sanggarList.map((s) => s.name), [sanggarList]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return produkList.filter((produk) => {
      const matchQuery =
        q === "" ||
        produk.productName.toLowerCase().includes(q) ||
        (produk.category?.categoryName ?? "").toLowerCase().includes(q) ||
        (produk.sanggar?.name ?? "").toLowerCase().includes(q);
      const matchSanggar = sanggarFilter ? produk.sanggar?.name === sanggarFilter : true;
      return matchQuery && matchSanggar;
    });
  }, [produkList, query, sanggarFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (produk: ManagedProduct) => {
    const confirmed = window.confirm(`Hapus produk "${produk.productName}"?`);
    if (!confirmed) return;
    deleteProduk.mutate(produk.id);
  };

  const handleEditSubmit = (values: ProdukEditFormValues) => {
    if (!editingProduk) return;
    updateProduk.mutate(
      {
        id: editingProduk.id,
        data: {
          productName: values.productName,
          categoryId: Number(values.categoryId),
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description,
          image: values.image,
        },
      },
      {
        onSuccess: () => setEditingProduk(null),
      }
    );
  };

  if (isPending) return <p className="text-sm text-[#777777]">Memuat data produk...</p>;
  if (isError) return <p className="text-sm text-red-500">Gagal mengambil data produk.</p>;

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
                    src={produk.image || "/placeholder-produk.jpg"}
                    alt={produk.productName}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[#333333]">{produk.productName}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.sanggar?.name ?? "-"}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.category?.categoryName ?? "-"}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{formatRupiah(produk.price)}</td>
                <td className="px-6 py-4 text-sm text-[#666666]">{produk.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduk(produk)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e2e2] text-[#3e3e3e] transition hover:bg-[#f5f5f5]"
                      aria-label="Edit produk"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(produk)}
                      disabled={deleteProduk.isPending}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                      aria-label="Hapus produk"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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

      <ProdukEditModal
        open={editingProduk !== null}
        initialValues={editingProduk ? toFormValues(editingProduk) : undefined}
        isSubmitting={updateProduk.isPending}
        onClose={() => setEditingProduk(null)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default SuperAdminProdukPage;