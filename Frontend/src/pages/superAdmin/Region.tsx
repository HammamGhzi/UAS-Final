import { useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "@/components/superAdmin/Pagination";
import {
  regionToFormValues,
  type RegionFormValues,
  type RegionRecord,
} from "@/pages/superAdmin/RegionStore";
import {
  useRegionsList,
  useCreateRegion,
  useDeleteRegion,
  useUpdateRegion,
} from "@/pages/superAdmin/useRegion";
import RegionFormModal from "@/pages/superAdmin/regionFormModal";

const PAGE_SIZE = 8;

const formatTanggal = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const SuperAdminRegionsPage = () => {
  const { data: regions = [], isLoading, isError, error, refetch } = useRegionsList();
  const createRegion = useCreateRegion();
  const updateRegion = useUpdateRegion();
  const deleteRegion = useDeleteRegion();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionRecord | null>(null);

  const filtered = useMemo(() => {
    return regions
      .filter((region) => region.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regions, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingRegion(null);
    setModalOpen(true);
  };

  const openEditModal = (region: RegionRecord) => {
    setEditingRegion(region);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRegion(null);
  };

  const handleSubmit = (values: RegionFormValues) => {
    if (editingRegion) {
      updateRegion.mutate(
        { id: editingRegion.id, values },
        {
          onSuccess: closeModal,
          onError: (err: any) => alert(err?.response?.data?.message || "Gagal memperbarui wilayah."),
        }
      );
    } else {
      createRegion.mutate(values, {
        onSuccess: closeModal,
        onError: (err: any) => alert(err?.response?.data?.message || "Gagal membuat wilayah."),
      });
    }
  };

  const handleDelete = (region: RegionRecord) => {
    const totalSanggar = region.sanggars?.length ?? 0;
    const warning =
      totalSanggar > 0
        ? `\n\nWilayah ini masih dipakai oleh ${totalSanggar} sanggar. Penghapusan akan ditolak backend selama sanggar masih terhubung.`
        : "";
    const confirmed = window.confirm(`Hapus wilayah "${region.name}"?${warning}`);
    if (!confirmed) return;

    deleteRegion.mutate(region.id, {
      onError: (err: any) => alert(err?.response?.data?.message || "Gagal menghapus wilayah."),
    });
  };

  const isSubmitting = createRegion.isPending || updateRegion.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Wilayah</h1>
          <p className="mt-1 text-sm text-[#777777]">
            Kelola daftar wilayah yang dipakai admin sanggar saat mendaftarkan toko.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-[48px] items-center justify-center gap-2 rounded-[16px] bg-[#ff9800] px-5 text-sm font-bold text-white transition hover:bg-[#e88a00]"
        >
          <Plus size={18} />
          Tambah Wilayah
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
          placeholder="Cari nama wilayah..."
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-[24px] border border-[#e2e2e2] bg-white py-16 text-[#777777]">
          <Loader2 size={18} className="animate-spin" />
          Memuat data wilayah...
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600">
          <p className="font-semibold">Gagal memuat wilayah.</p>
          <p className="mt-1 text-sm">{(error as any)?.response?.data?.message || (error as Error)?.message}</p>
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
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eeeeee] text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">
                  <th className="px-6 py-4">Nama Wilayah</th>
                  <th className="px-6 py-4">Jumlah Sanggar</th>
                  <th className="px-6 py-4">Dibuat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((region) => (
                  <tr key={region.id} className="border-b border-[#f2f2f2] last:border-0">
                    <td className="px-6 py-4 text-sm font-bold text-[#333333]">{region.name}</td>
                    <td className="px-6 py-4 text-sm text-[#666666]">{region.sanggars?.length ?? 0} sanggar</td>
                    <td className="px-6 py-4 text-sm text-[#666666]">{formatTanggal(region.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(region)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9c9c9] text-[#4b4b4b] transition hover:bg-[#f5f5f5]"
                          aria-label={`Edit ${region.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(region)}
                          disabled={deleteRegion.isPending}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Hapus ${region.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#777777]">
                      Wilayah tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <RegionFormModal
        open={modalOpen}
        mode={editingRegion ? "edit" : "create"}
        initialValues={editingRegion ? regionToFormValues(editingRegion) : undefined}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SuperAdminRegionsPage;