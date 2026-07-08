import { useMemo, useState } from "react";
import { Pencil, Search } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import { useSanggars, useUpdateSanggar, useDeleteSanggar, type ManagedSanggar } from "./useSanggar";
import { useRegionsList } from "./useRegion";
import SanggarEditModal from "./sanggarEditModal";
import type { SanggarEditFormValues } from "./sanggarEditStore";

const PAGE_SIZE = 6;
const FALLBACK_IMAGE = "/placeholder-sanggar.jpg"; // ganti sesuai asset default kamu

const toFormValues = (sanggar: ManagedSanggar): SanggarEditFormValues => ({
  name: sanggar.name,
  regionId: String(sanggar.regionId),
  ownerName: sanggar.ownerName,
  address: sanggar.address,
  latitude: String(sanggar.latitude),
  longitude: String(sanggar.longitude),
  phone: sanggar.phone ?? "",
  description: sanggar.description ?? "",
  image: sanggar.image ?? "",
});

const SuperAdminSanggarPage = () => {
  const { data: sanggarList = [], isPending, isError } = useSanggars();
  const { data: regions = [] } = useRegionsList();
  const updateSanggar = useUpdateSanggar();
  const deleteSanggar = useDeleteSanggar();

  const [query, setQuery] = useState("");
  const [wilayah, setWilayah] = useState(""); // "" = semua wilayah, isinya nama region
  const [page, setPage] = useState(1);
  const [editingSanggar, setEditingSanggar] = useState<ManagedSanggar | null>(null);

  const wilayahOptions = useMemo(() => regions.map((r) => r.name), [regions]);

  const filtered = useMemo(() => {
    return sanggarList.filter((sanggar) => {
      const matchQuery = sanggar.name.toLowerCase().includes(query.toLowerCase());
      const matchWilayah = wilayah ? sanggar.region?.name === wilayah : true;
      return matchQuery && matchWilayah;
    });
  }, [sanggarList, query, wilayah]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handleDelete = (sanggar: { id: number; name: string }) => {
    const confirmed = window.confirm(`Hapus "${sanggar.name}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;
    deleteSanggar.mutate(sanggar.id);
  };

  const handleEditSubmit = (values: SanggarEditFormValues) => {
    if (!editingSanggar) return;
    updateSanggar.mutate(
      {
        id: editingSanggar.id,
        data: {
          name: values.name,
          regionId: Number(values.regionId),
          ownerName: values.ownerName,
          address: values.address,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          phone: values.phone,
          description: values.description,
          image: values.image,
        },
      },
      {
        onSuccess: () => setEditingSanggar(null),
      }
    );
  };

  if (isPending) return <p className="text-sm text-[#777777]">Memuat data sanggar...</p>;
  if (isError) return <p className="text-sm text-red-500">Gagal mengambil data sanggar.</p>;

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
          options={wilayahOptions}
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
            <div className="h-[220px] w-full overflow-hidden rounded-[18px] bg-[#f2f2f2]">
              <img
                src={sanggar.image || FALLBACK_IMAGE}
                alt={sanggar.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-extrabold text-[#2f2f2f]">{sanggar.name}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">
                {sanggar.region?.name ?? "-"}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[#8a8a8a]">{sanggar.ownerName}</span>
                <span className="text-xs text-[#8a8a8a]">{sanggar.products?.length ?? 0} produk</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSanggar(sanggar)}
                  className="flex h-[42px] w-[52px] items-center justify-center rounded-full border border-[#e2e2e2] text-[#3e3e3e] transition hover:bg-[#f5f5f5]"
                  aria-label={`Edit ${sanggar.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sanggar)}
                  disabled={deleteSanggar.isPending}
                  className="flex-1 rounded-full bg-[#ff6b6b] py-2.5 text-sm font-bold text-white transition hover:bg-[#e85555] disabled:opacity-60"
                >
                  {deleteSanggar.isPending && deleteSanggar.variables === sanggar.id
                    ? "Menghapus..."
                    : "Hapus Sanggar"}
                </button>
              </div>
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

      <SanggarEditModal
        open={editingSanggar !== null}
        initialValues={editingSanggar ? toFormValues(editingSanggar) : undefined}
        regions={regions}
        isSubmitting={updateSanggar.isPending}
        onClose={() => setEditingSanggar(null)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default SuperAdminSanggarPage;