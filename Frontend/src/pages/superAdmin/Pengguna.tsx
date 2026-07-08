import { useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "@/components/superAdmin/Pagination";
import {
  ROLE_LABELS,
  ROLE_OPTIONS,
  userToFormValues,
  type UserFormValues,
  type UserRecord,
} from "@/pages/superAdmin/UserStore";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/pages/superAdmin/useUsers";
import UserFormModal from "@/pages/superAdmin/userFormModal";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Role } from "@/types/auth";

const PAGE_SIZE = 8;

const formatTanggal = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const roleBadgeClass = (role: Role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-[#ffe6e6] text-[#d64545]";
    case "ADMIN":
      return "bg-[#e6f0ff] text-[#2b6fd6]";
    default:
      return "bg-[#eaf7ea] text-[#3a9d3a]";
  }
};

const SuperAdminPenggunaPage = () => {
  const currentUserId = useAuthStore((state) => state.user?.id);

  const { data: users = [], isLoading, isError, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchQuery = u.email.toLowerCase().includes(query.toLowerCase());
      const matchRole = roleFilter ? u.role === roleFilter : true;
      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (values: UserFormValues) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, values },
        {
          onSuccess: closeModal,
          onError: (err: any) => {
            alert(err?.response?.data?.message || "Gagal memperbarui pengguna.");
          },
        }
      );
    } else {
      createUser.mutate(values, {
        onSuccess: closeModal,
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Gagal membuat pengguna.");
        },
      });
    }
  };

  const handleDelete = (user: UserRecord) => {
    if (user.id === currentUserId) {
      alert("Tidak bisa menghapus akun yang sedang login.");
      return;
    }

    if (!window.confirm(`Hapus akun "${user.email}" (${ROLE_LABELS[user.role]})?`)) return;

    deleteUser.mutate(user.id, {
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Gagal menghapus pengguna.");
      },
    });
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Pengguna</h1>
          <p className="mt-1 text-sm text-[#777777]">
            Kelola akun Super Admin, Admin Sanggar, dan User yang terdaftar.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-[48px] items-center justify-center gap-2 rounded-[16px] bg-[#ff9800] px-5 text-sm font-bold text-white transition hover:bg-[#e88a00]"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-[16px] border border-[#c9c9c9] bg-white px-4">
          <Search size={20} className="text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari email..."
            className="h-full flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as Role | "");
            setPage(1);
          }}
          className="h-[48px] rounded-[16px] border border-[#c9c9c9] px-4 text-sm"
        >
          <option value="">Semua Role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-[24px] border border-[#e2e2e2] bg-white py-16 text-[#777777]">
          <Loader2 size={18} className="animate-spin" />
          Memuat data pengguna...
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600">
          <p className="font-semibold">Gagal memuat data pengguna.</p>
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
                    <td className="px-6 py-4 text-sm text-[#333333]">
                      {user.email}
                      {user.id === currentUserId && (
                        <span className="ml-2 rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-bold text-[#888888]">
                          Anda
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${roleBadgeClass(
                          user.role
                        )}`}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8a8a8a]">
                      {formatTanggal(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9c9c9] text-[#4b4b4b] transition hover:bg-[#f5f5f5]"
                          aria-label={`Edit ${user.email}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deleteUser.isPending}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Hapus ${user.email}`}
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
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <UserFormModal
        open={modalOpen}
        mode={editingUser ? "edit" : "create"}
        initialValues={editingUser ? userToFormValues(editingUser) : undefined}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SuperAdminPenggunaPage;