import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Boxes, LayoutGrid, LogOut, Menu, Settings, Star, Store, X } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

const sidebarItems = [
  { to: "/admin-sanggar", icon: LayoutGrid, label: "Dashboard" },
  { to: "/admin-sanggar/products", icon: Boxes, label: "Produk" },
  { to: "/admin-sanggar/reviews", icon: Star, label: "Reviews" },
  { to: "/admin-sanggar/settings", icon: Settings, label: "Setelan" },
];

const AdminSanggarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Tutup drawer otomatis tiap pindah halaman (biar gak nyangkut kebuka di HP/tablet)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate("/form/login");
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-1 flex-col items-center gap-4">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 transition md:h-9 md:w-9 md:justify-center md:px-0 md:py-0 ${
              active
                ? "bg-[#fff4df] text-[#ff9800]"
                : "text-[#7a7a7a] hover:bg-[#f2f2f2]"
            }`}
            aria-label={item.label}
            title={item.label}
          >
            <Icon size={20} strokeWidth={active ? 2.6 : 2.2} className="shrink-0" />
            <span className="text-sm font-bold md:hidden">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#202020]">
      {/* Sidebar desktop/tablet mengikuti layout Super Admin */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col items-center border-r border-[#eceef3] bg-white py-5 md:flex">
        <button
          type="button"
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg text-[#222222] transition hover:bg-[#f2f2f2]"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <NavLinks />

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8b8b8b] transition hover:bg-[#fff1f1] hover:text-red-500"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* Overlay + drawer sidebar untuk HP/tablet, muncul saat tombol menu di header ditekan */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col bg-white px-5 py-7 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <Store size={18} className="text-[#b6ec00]" />
            </div>
            <span className="text-sm font-extrabold text-[#252525]">Admin Sanggar</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#222222] transition hover:bg-[#f2f2f2]"
            aria-label="Tutup menu"
          >
            <X size={22} />
          </button>
        </div>

        <NavLinks onNavigate={() => setMobileOpen(false)} />

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-2.5 text-[#8b8b8b] transition hover:bg-[#fff1f1] hover:text-red-500"
          aria-label="Logout"
        >
          <LogOut size={24} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </aside>

      <div className="min-h-screen md:pl-16">
        <header className="flex h-[76px] items-center justify-between gap-3 px-4 sm:h-[92px] sm:px-6 md:justify-end md:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#222222] transition hover:bg-[#f2f2f2] md:hidden"
            aria-label="Buka menu"
          >
            <Menu size={26} strokeWidth={2.4} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Store size={20} className="text-[#b6ec00]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold leading-tight text-[#3b3b3b] sm:text-[16px]">
                {user?.email || "Admin Sanggar"}
              </p>
              <p className="text-[12px] leading-tight text-[#555555] sm:text-[13px]">Admin Sanggar</p>
            </div>
          </div>
        </header>

        <main className="px-4 pb-12 pt-4 sm:px-6 md:px-[clamp(1.5rem,5vw,3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminSanggarLayout;
