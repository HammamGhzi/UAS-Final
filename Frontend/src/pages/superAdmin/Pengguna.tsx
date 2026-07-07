import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import Pagination from "@/components/superAdmin/Pagination";
import { useUsers, useUpdateUserRole, useDeleteUser, type ManagedUser } from "./useUsers";
import type { Role } from "@/types/auth";

const PAGE_SIZE = 8;
const ROLE_OPTIONS: Role[] = ["SUPER_ADMIN", "ADMIN", "USER"];

const SuperAdminPenggunaPage = () => {
  const { data: users = [], isPending, isError } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchQuery = u.email.toLowerCase().includes(query.toLowerCase());
      const matchRole = roleFilter ? u.role === roleFilter : true;
      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleChangeRole = (user: ManagedUser, role: Role) => {
    updateRole.mutate({ id: user.id, role });
  };

  const handleDelete = (user: ManagedUser) => {
    if (!window.confirm(`Hapus akun "${user.email}"?`)) return;
    deleteUser.mutate(user.id);
  };

  if (isPending) return <p>Memuat data pengguna...</p>;
  if (isError) return <p>Gagal mengambil data pengguna.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Pengguna</h1>
        <p className="mt-1 text-sm text-[#777777]">
          Kelola akun Super Admin, Admin Sanggar, dan User yang terdaftar.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-[16px] border border-[#c9c9c9] bg-white px-4">
          <Search size={20} className="text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari email..."
            className="h-full flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as Role | ""); setPage(1); }}
          className="h-[48px] rounded-[16px] border border-[#c9c9c9] px-4 text-sm"
        >
          <option value="">Semua Role</option>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[#e2e2e2] bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#eeeeee] text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Terdaftar</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id} className="border-b border-[#f2f2f2] last:border-0">
                <td className="px-6 py-4 text-sm text-[#333333]">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user, e.target.value as Role)}
                    disabled={updateRole.isPending}
                    className="rounded-lg border border-[#e2e2e2] px-2 py-1 text-sm font-semibold"
                  >
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-[#8a8a8a]">
                  {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={deleteUser.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 hover:bg-red-50 ml-auto"
                    aria-label="Hapus user"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#777777]">
                  Tidak ada data ditemukan.
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

export default SuperAdminPenggunaPage;