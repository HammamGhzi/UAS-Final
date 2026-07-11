import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Map, MapPin, Menu, Package, ShieldCheck, Star, Tag, Users } from "lucide-react";
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

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (to: string) =>
    to === "/super-admin" ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#202020]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-[#eceef3] bg-white py-5">
        <button
          type="button"
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg text-[#222222] transition hover:bg-[#f2f2f2]"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-[#fff4df] text-[#ff9800]"
                    : "text-[#7a7a7a] hover:bg-[#f2f2f2]"
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
      </aside>

      <div className="min-h-screen pl-16">
        <header className="flex h-[92px] items-center justify-between px-8">
          <div className="flex h-[48px] w-[420px] max-w-full items-center gap-3 rounded-full border border-[#e4e4e4] bg-white px-5 text-[#8a8a8a]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <ShieldCheck size={20} className="text-[#b6ec00]" />
            </div>
           <p className="text-[16px] font-bold leading-tight text-[#3b3b3b]">
                {user?.email || "Super Admin"}
              </p>
              <p className="text-[13px] leading-tight text-[#555555]">Super Admin</p>
          </div>
        </header>

        <main className="px-[clamp(1.5rem,5vw,3.5rem)] pb-12 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;