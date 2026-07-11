import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Map, MapPin, Menu, Package, ShieldCheck, Star, Tag, Users, X } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

const sidebarItems = [
  { to: "/super-admin", icon: LayoutGrid, label: "Dashboard" },
  { to: "/super-admin/sanggar", icon: MapPin, label: "Sanggar" },
  { to: "/super-admin/produk", icon: Package, label: "Produk" },
  { to: "/super-admin/kategori", icon: Tag, label: "Kategori Batik" },
  { to: "/super-admin/regions", icon: Map, label: "Wilayah" },
  { to: "/super-admin/reviews", icon: Star, label: "Reviews" },
  { to: "/super-admin/pengguna", icon: Users, label: "Pengguna" },
];

const SuperAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (to: string) =>
    to === "/super-admin" ? location.pathname === to : location.pathname.startsWith(to);

  const SidebarContent = () => (
    <>
      <nav className="flex flex-1 flex-col items-center gap-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                active ? "bg-[#fff4df] text-[#ff9800]" : "text-[#7a7a7a] hover:bg-[#f2f2f2]"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon size={20} strokeWidth={active ? 2.6 : 2.2} />
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8b8b8b] transition hover:bg-[#fff1f1] hover:text-red-500"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#202020]">

      {/* Sidebar Desktop — fixed, hanya muncul di md ke atas */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-16 flex-col items-center border-r border-[#eceef3] bg-white py-5">
        <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg text-[#222222]">
          <Menu size={20} strokeWidth={2.2} />
        </div>
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Mobile — slide in dari kiri */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-[#eceef3] bg-white py-5 px-3 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <span className="font-bold text-[#202020]">Super Admin</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7a7a7a] hover:bg-[#f2f2f2]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav mobile dengan label */}
        <nav className="flex flex-1 flex-col gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-[#fff4df] text-[#ff9800]" : "text-[#7a7a7a] hover:bg-[#f2f2f2]"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.6 : 2.2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8b8b8b] transition hover:bg-[#fff1f1] hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="min-h-screen md:pl-16">
        <header className="flex h-[72px] items-center justify-between px-4 md:px-8">

          {/* Hamburger — hanya di mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#222222] transition hover:bg-[#f2f2f2] md:hidden"
            aria-label="Buka menu"
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

          {/* Search bar — hidden di mobile kecil */}
          <div className="hidden sm:flex h-[44px] w-[360px] max-w-full items-center gap-3 rounded-full border border-[#e4e4e4] bg-white px-5 text-[#8a8a8a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <ShieldCheck size={18} className="text-[#b6ec00]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-[#3b3b3b]">
                {user?.email || "Super Admin"}
              </p>
              <p className="text-xs leading-tight text-[#555555]">Super Admin</p>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-[clamp(1.5rem,5vw,3.5rem)] pb-12 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
