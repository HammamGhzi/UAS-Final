import { useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "@/components/superAdmin/Pagination";
import {
  categoryToFormValues,
  type CategoryFormValues,
  type CategoryRecord,
} from "@/pages/superAdmin/CategoryStore";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/pages/superAdmin/useCategories";
import CategoryFormModal from "@/pages/superAdmin/categoryFormModal";

const PAGE_SIZE = 8;

const formatTanggal = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const SuperAdminKategoriPage = () => {
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);

  const filtered = useMemo(() => {
    return categories
      .filter((category) =>
        category.categoryName.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [categories, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: CategoryRecord) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, values },
        {
          onSuccess: closeModal,
          onError: (err: any) => {
            alert(err?.response?.data?.message || "Gagal memperbarui kategori.");
          },
        }
      );
    } else {
      createCategory.mutate(values, {
        onSuccess: closeModal,
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Gagal membuat kategori.");
        },
      });
    }
  };

  const handleDelete = (category: CategoryRecord) => {
    const totalProduk = category.products?.length ?? 0;
    const warningProduk =
      totalProduk > 0
        ? `\n\nKategori ini masih dipakai oleh ${totalProduk} produk. Penghapusan bisa ditolak backend selama produk masih terhubung.`
        : "";
    const confirmed = window.confirm(
      `Hapus kategori "${category.categoryName}"?${warningProduk}`
    );
    if (!confirmed) return;

    deleteCategory.mutate(category.id, {
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Gagal menghapus kategori.");
      },
    });
  };

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Kategori Batik</h1>
          <p className="mt-1 text-sm text-[#777777]">
            Kelola kategori motif batik yang dipakai untuk mengelompokkan produk.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-[48px] items-center justify-center gap-2 rounded-[16px] bg-[#ff9800] px-5 text-sm font-bold text-white transition hover:bg-[#e88a00]"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-[16px] border border-[#c9c9c9] bg-white px-4">
        <Search size={20} className="text-[#8a8a8a]" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Cari nama kategori..."
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-[24px] border border-[#e2e2e2] bg-white py-16 text-[#777777]">
          <Loader2 size={18} className="animate-spin" />
          Memuat data kategori...
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600">
          <p className="font-semibold">Gagal memuat kategori.</p>
          <p className="mt-1 text-sm">
            {(error as any)?.response?.data?.message || (error as Error)?.message}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-[24px] border border-[#e2e2e2] bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eeeeee] text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">
                  <th className="px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4">Jumlah Produk</th>
                  <th className="px-6 py-4">Dibuat</th>
                  <th className="px-6 py-4">Diperbarui</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((category) => (
                  <tr key={category.id} className="border-b border-[#f2f2f2] last:border-0">
                    <td className="px-6 py-4 text-sm font-bold text-[#333333]">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666666]">
                      {category.products?.length ?? 0} produk
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666666]">
                      {formatTanggal(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666666]">
                      {formatTanggal(category.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9c9c9] text-[#4b4b4b] transition hover:bg-[#f5f5f5]"
                          aria-label={`Edit ${category.categoryName}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deleteCategory.isPending}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Hapus ${category.categoryName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#777777]">
                      Kategori tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <CategoryFormModal
        open={modalOpen}
        mode={editingCategory ? "edit" : "create"}
        initialValues={editingCategory ? categoryToFormValues(editingCategory) : undefined}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SuperAdminKategoriPage;