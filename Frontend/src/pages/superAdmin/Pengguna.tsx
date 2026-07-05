import { useMemo, useState } from "react";
import { ArrowUpDown, MoreHorizontal, Search, Trash2 } from "lucide-react";
import FilterDropdown from "@/components/superAdmin/FilterDropdown";
import Pagination from "@/components/superAdmin/Pagination";
import {
  adminList as initialAdminList,
  customerList as initialCustomerList,
  type AdminRole,
  type SuperAdminAdmin,
  type SuperAdminCustomer,
} from "./data";

const PAGE_SIZE = 6;
const ROLE_OPTIONS: AdminRole[] = ["Manager", "Designer", "Developer"];

type Tab = "admin" | "customer";
type SortKey = "nama" | "email";
type SortDir = "asc" | "desc";

const roleColor: Record<AdminRole, string> = {
  Manager: "text-[#3b82f6]",
  Designer: "text-[#8a8a8a]",
  Developer: "text-[#8a8a8a]",
};

const SuperAdminPenggunaPage = () => {
  const [tab, setTab] = useState<Tab>("admin");

  // TODO(backend): ganti dua useState ini dengan hasil GET /super-admin/admin dan /super-admin/customers
  const [adminList, setAdminList] = useState<SuperAdminAdmin[]>(initialAdminList);
  const [customerList, setCustomerList] = useState<SuperAdminCustomer[]>(initialCustomerList);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const switchTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    setRoleFilter("");
    setPage(1);
    setOpenMenuId(null);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredAdmin = useMemo(() => {
    const rows = adminList.filter((admin) => {
      const matchQuery =
        admin.nama.toLowerCase().includes(query.toLowerCase()) ||
        admin.email.toLowerCase().includes(query.toLowerCase());
      const matchRole = roleFilter ? admin.role === roleFilter : true;
      return matchQuery && matchRole;
    });
    rows.sort((a, b) => {
      const result = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? result : -result;
    });
    return rows;
  }, [adminList, query, roleFilter, sortKey, sortDir]);

  const filteredCustomer = useMemo(() => {
    const rows = customerList.filter(
      (customer) =>
        customer.nama.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
    );
    rows.sort((a, b) => {
      const result = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? result : -result;
    });
    return rows;
  }, [customerList, query, sortKey, sortDir]);

  const rows = tab === "admin" ? filteredAdmin : filteredCustomer;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteAdmin = (admin: SuperAdminAdmin) => {
    if (!window.confirm(`Hapus admin "${admin.nama}"?`)) return;
    // TODO(backend): panggil DELETE /super-admin/admin/:id lalu refetch
    setAdminList((prev) => prev.filter((item) => item.id !== admin.id));
    setOpenMenuId(null);
  };

  const handleChangeRole = (admin: SuperAdminAdmin, role: AdminRole) => {
    // TODO(backend): panggil PATCH /super-admin/admin/:id { role } lalu refetch
    setAdminList((prev) =>
      prev.map((item) => (item.id === admin.id ? { ...item, role } : item))
    );
    setOpenMenuId(null);
  };

  const handleDeleteCustomer = (customer: SuperAdminCustomer) => {
    if (!window.confirm(`Hapus customer "${customer.nama}"?`)) return;
    // TODO(backend): panggil DELETE /super-admin/customers/:id lalu refetch
    setCustomerList((prev) => prev.filter((item) => item.id !== customer.id));
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Pengguna</h1>
        <p className="mt-1 text-sm text-[#777777]">
          Kelola akun admin sanggar dan customer yang terdaftar di platform.
        </p>
      </div>

      <div className="flex gap-2 rounded-full bg-[#eceef5] p-1 w-fit">
        <button
          type="button"
          onClick={() => switchTab("admin")}
          className={`rounded-full px-5 py-2 text-sm font-bold transition ${
            tab === "admin" ? "bg-white text-[#2f2f2f] shadow-sm" : "text-[#8a8a8a]"
          }`}
        >
          Admin Sanggar
        </button>
        <button
          type="button"
          onClick={() => switchTab("customer")}
          className={`rounded-full px-5 py-2 text-sm font-bold transition ${
            tab === "customer" ? "bg-white text-[#2f2f2f] shadow-sm" : "text-[#8a8a8a]"
          }`}
        >
          Customers
        </button>
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
            placeholder={tab === "admin" ? "Cari admin sanggar..." : "Cari customer..."}
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        {tab === "admin" && (
          <FilterDropdown
            label="Role"
            value={roleFilter}
            options={ROLE_OPTIONS}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            allLabel="Semua Role"
          />
        )}
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[#e2e2e2] bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#eeeeee] text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => toggleSort("nama")}
                  className="flex items-center gap-1 hover:text-[#4b4b4b]"
                >
                  Nama <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => toggleSort("email")}
                  className="flex items-center gap-1 hover:text-[#4b4b4b]"
                >
                  Email <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="px-6 py-4">Telepon</th>
              <th className="px-6 py-4">{tab === "admin" ? "Role" : "Total Transaksi"}</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tab === "admin" &&
              (paginated as SuperAdminAdmin[]).map((admin) => (
                <tr key={admin.id} className="border-b border-[#f2f2f2] last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={admin.avatar} alt={admin.nama} className="h-10 w-10 rounded-full" />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                            admin.online ? "bg-[#2fbf71]" : "bg-[#c9c9c9]"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#333333]">{admin.nama}</p>
                        <p className="text-xs text-[#8a8a8a]">{admin.sanggarNama}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#333333]">{admin.email}</p>
                    <p className="text-xs text-[#a0a0a0]">Email</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#333333]">{admin.telepon}</p>
                    <p className="text-xs text-[#a0a0a0]">Phone</p>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${roleColor[admin.role]}`}>
                    {admin.role}
                  </td>
                  <td className="relative px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                      className="rounded-lg p-2 text-[#8a8a8a] hover:bg-[#f5f5f5]"
                      aria-label="Aksi"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenuId === admin.id && (
                      <div className="absolute right-6 top-14 z-10 w-48 rounded-2xl border border-[#eaeaea] bg-white p-2 text-left shadow-lg">
                        <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-[#a0a0a0]">
                          Ubah Role
                        </p>
                        {ROLE_OPTIONS.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleChangeRole(admin, role)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#f5f5f5] ${
                              admin.role === role ? "text-[#3b82f6]" : "text-[#4b4b4b]"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                        <div className="my-1 h-px bg-[#f0f0f0]" />
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(admin)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Hapus Admin
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

            {tab === "customer" &&
              (paginated as SuperAdminCustomer[]).map((customer) => (
                <tr key={customer.id} className="border-b border-[#f2f2f2] last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={customer.avatar} alt={customer.nama} className="h-10 w-10 rounded-full" />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                            customer.online ? "bg-[#2fbf71]" : "bg-[#c9c9c9]"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#333333]">{customer.nama}</p>
                        <p className="text-xs text-[#8a8a8a]">Customer</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#333333]">{customer.email}</p>
                    <p className="text-xs text-[#a0a0a0]">Email</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#333333]">{customer.telepon}</p>
                    <p className="text-xs text-[#a0a0a0]">Phone</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#333333]">
                    {customer.totalTransaksi}x
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(customer)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d2d2] text-red-500 transition hover:bg-red-50 ml-auto"
                      aria-label="Hapus customer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#777777]">
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