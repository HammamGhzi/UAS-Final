import { Boxes, MessageSquareText, Store, Users } from "lucide-react";
import { useDashboardSummary } from "./useDashboardSummary";

// Avatar/foto placeholder dari inisial nama — dipakai kalau sanggar/reviewer
// tidak punya foto (kolom image bisa null, dan Review/User memang tidak
// menyimpan foto profil di skema saat ini).
const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "bg-[#e9e6fb] text-[#7c6ee8]",
  "bg-[#fdf0d8] text-[#e8a33d]",
  "bg-[#d9f7e8] text-[#2fbf71]",
  "bg-[#dceefe] text-[#3b9ae1]",
  "bg-[#fde2e2] text-[#e15b5b]",
];

const colorForName = (name: string) => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const InitialAvatar = ({ name, className = "" }: { name: string; className?: string }) => (
  <div
    className={`flex items-center justify-center rounded-full font-bold ${colorForName(
      name
    )} ${className}`}
  >
    {getInitials(name) || "?"}
  </div>
);

const SuperAdminDashboard = () => {
  const { data, isPending, isError } = useDashboardSummary();

  if (isPending) {
    return <p className="text-sm text-[#777777]">Memuat data dashboard...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-500">Gagal mengambil data dashboard.</p>;
  }

  const { totals, newThisWeek, avgRating, topRatedProducts, recentReviews } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#777777]">Ringkasan seluruh aktivitas platform.</p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total User"
          value={totals.users}
          trend={`+${newThisWeek.users} user baru minggu ini`}
          icon={<Users size={22} />}
          iconBg="bg-[#e9e6fb] text-[#7c6ee8]"
        />
        <StatCard
          title="Total Produk"
          value={totals.products}
          trend={`+${newThisWeek.products} produk baru minggu ini`}
          icon={<Boxes size={22} />}
          iconBg="bg-[#fdf0d8] text-[#e8a33d]"
        />
        <StatCard
          title="Total Sanggar"
          value={totals.sanggars}
          trend={`+${newThisWeek.sanggars} sanggar baru minggu ini`}
          icon={<Store size={22} />}
          iconBg="bg-[#d9f7e8] text-[#2fbf71]"
        />
        <StatCard
          title="Total Review"
          value={totals.reviews}
          trend={`Rata-rata rating ${avgRating.toFixed(1)}`}
          icon={<MessageSquareText size={22} />}
          iconBg="bg-[#dceefe] text-[#3b9ae1]"
          trendColor="text-[#3b9ae1]"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
          <h2 className="text-lg font-extrabold text-[#2f2f2f]">Produk dengan rating tertinggi</h2>
          <div className="mt-4 space-y-4">
            {topRatedProducts.length === 0 && (
              <p className="text-sm text-[#8a8a8a]">Belum ada produk dengan review.</p>
            )}
            {topRatedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <InitialAvatar name={product.name} className="h-10 w-10 rounded-xl text-sm" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-[#333333]">{product.name}</p>
                    <p className="text-xs text-[#8a8a8a]">{product.sanggarName}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#ff9800]">
                  {product.avgRating.toFixed(1)} ★
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
          <h2 className="text-lg font-extrabold text-[#2f2f2f]">Review terbaru</h2>
          <div className="mt-4 space-y-4">
            {recentReviews.length === 0 && (
              <p className="text-sm text-[#8a8a8a]">Belum ada review masuk.</p>
            )}
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3">
                <InitialAvatar name={review.reviewerName} className="h-9 w-9 shrink-0 text-xs" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#333333]">
                    {review.reviewerName}{" "}
                    <span className="font-normal text-[#8a8a8a]">
                      &middot; Produk &middot; {review.productName} ({review.sanggarName})
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-[#777777]">
                    {review.comment || "Tidak ada komentar."}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-[#ff9800]">
                  {review.rating.toFixed(1)} ★
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  iconBg: string;
  trendColor?: string;
}

const StatCard = ({ title, value, trend, icon, iconBg, trendColor = "text-[#2fbf71]" }: StatCardProps) => (
  <div className="rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
    <div className="flex items-start justify-between">
      <p className="text-sm font-bold text-[#777777]">{title}</p>
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
    </div>
    <p className="mt-4 text-[34px] font-extrabold leading-none text-[#262626]">{value}</p>
    <p className={`mt-3 text-xs font-semibold ${trendColor}`}>{trend}</p>
  </div>
);

export default SuperAdminDashboard;