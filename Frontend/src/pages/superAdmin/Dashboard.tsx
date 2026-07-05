import { Boxes, MessageSquareText, Store, Users } from "lucide-react";
import { adminList, customerList, produkList, reviewList, sanggarList } from "./data";

// TODO(backend): ganti angka-angka di bawah ini dengan hasil GET /super-admin/summary
const totalUser = adminList.length + customerList.length;
const totalProduk = produkList.length;
const totalSanggar = sanggarList.length;
const totalReview = reviewList.length;
const avgRating =
  sanggarList.reduce((sum, s) => sum + s.rating, 0) / (sanggarList.length || 1);

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#777777]">Ringkasan seluruh aktivitas platform.</p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total User"
          value={totalUser}
          trend="8.5% Up from yesterday"
          icon={<Users size={22} />}
          iconBg="bg-[#e9e6fb] text-[#7c6ee8]"
        />
        <StatCard
          title="Total Produk"
          value={totalProduk}
          trend="1.3% Up from past week"
          icon={<Boxes size={22} />}
          iconBg="bg-[#fdf0d8] text-[#e8a33d]"
        />
        <StatCard
          title="Total Sanggar"
          value={totalSanggar}
          trend="1.3% Up from past week"
          icon={<Store size={22} />}
          iconBg="bg-[#d9f7e8] text-[#2fbf71]"
        />
        <StatCard
          title="Total Review"
          value={totalReview}
          trend={`Rata-rata rating ${avgRating.toFixed(1)}`}
          icon={<MessageSquareText size={22} />}
          iconBg="bg-[#dceefe] text-[#3b9ae1]"
          trendColor="text-[#3b9ae1]"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
          <h2 className="text-lg font-extrabold text-[#2f2f2f]">Sanggar dengan rating tertinggi</h2>
          <div className="mt-4 space-y-4">
            {[...sanggarList]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((sanggar) => (
                <div key={sanggar.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={sanggar.foto}
                      alt={sanggar.nama}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#333333]">{sanggar.nama}</p>
                      <p className="text-xs text-[#8a8a8a]">{sanggar.wilayah}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#ff9800]">
                    {sanggar.rating.toFixed(1)} ★
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
          <h2 className="text-lg font-extrabold text-[#2f2f2f]">Review terbaru</h2>
          <div className="mt-4 space-y-4">
            {reviewList.slice(0, 5).map((review) => (
              <div key={review.id} className="flex items-start gap-3">
                <img src={review.avatar} alt={review.nama} className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#333333]">
                    {review.nama}{" "}
                    <span className="font-normal text-[#8a8a8a]">
                      &middot; {review.jenis} &middot; {review.target}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-[#777777]">{review.komentar}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-[#ff9800]">
                  {review.rating}.0 ★
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