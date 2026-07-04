import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Boxes, LayoutGrid, LogOut, Menu, Settings, Star, Store } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

const sidebarItems = [
  { to: "/admin-sanggar", icon: LayoutGrid, label: "Utama", section: "Utama" },
  { to: "/admin-sanggar/products", icon: Boxes, label: "Produk", section: "Kelola" },
  { to: "/admin-sanggar/reviews", icon: Star, label: "Riwayat Rating", section: "Kelola" },
  { to: "/admin-sanggar/settings", icon: Settings, label: "Setelan", section: "Kelola" },
];

const AdminSanggarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#202020]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[88px] flex-col items-center bg-white py-9">
        <button
          type="button"
          className="mb-20 flex h-10 w-10 items-center justify-center rounded-xl text-[#222222] transition hover:bg-[#f2f2f2]"
          aria-label="Menu"
        >
          <Menu size={28} strokeWidth={2.4} />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-9">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                  active ? "text-[#ff9800]" : "text-[#7a7a7a] hover:bg-[#f2f2f2]"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={32} strokeWidth={active ? 3 : 2.8} />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#8b8b8b] transition hover:bg-[#fff1f1] hover:text-red-500"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={28} />
        </button>
      </aside>

      <div className="min-h-screen pl-[88px]">
        <header className="flex h-[92px] items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <Store size={20} className="text-[#b6ec00]" />
            </div>
            <div>
              <p className="text-[16px] font-bold leading-tight text-[#3b3b3b]">Hammam</p>
              <p className="text-[13px] leading-tight text-[#555555]">Admin Sanggar</p>
            </div>
          </div>
        </header>

        <main className="px-[clamp(2rem,5vw,4.25rem)] pb-12 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminSanggarLayout;