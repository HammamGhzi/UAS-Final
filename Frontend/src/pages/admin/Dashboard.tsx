import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';

type DashboardStats = {
  totalSanggar: number;
  totalProduk: number;
  totalReview: number;
  totalMotif: number;
};

const emptyStats: DashboardStats = {
  totalSanggar: 0,
  totalProduk: 0,
  totalReview: 0,
  totalMotif: 0,
};

const Dashboard = () => {
  const { data: stats = emptyStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await adminApi.getDashboard();
      return {
        totalSanggar: data.totalSanggar || 0,
        totalProduk: data.totalProduk || 0,
        totalReview: data.totalReview || 0,
        totalMotif: data.totalMotif || 0,
      };
    },
  });

  const chartData = [
    { name: 'Sanggar', value: stats.totalSanggar },
    { name: 'Produk', value: stats.totalProduk },
    { name: 'Review', value: stats.totalReview },
    { name: 'Motif', value: stats.totalMotif },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brown-900">Dashboard</h1>
        <p className="text-brown-600 mt-1">Ringkasan data sistem CANTING</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brown-500 text-sm">Total Sanggar</p>
              <p className="text-3xl font-bold text-brown-900 mt-1">
                {stats.totalSanggar}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-lime-600"
              >
                <path 
                  d="M21 10C21 14.9706 16.9706 19 12 19C7.02944 19 3 14.9706 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brown-500 text-sm">Total Produk</p>
              <p className="text-3xl font-bold text-brown-900 mt-1">
                {stats.totalProduk}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-lime-600">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brown-500 text-sm">Total Review</p>
              <p className="text-3xl font-bold text-brown-900 mt-1">
                {stats.totalReview}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-lime-600">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16L16 12M12 16L8 12M12 16V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brown-500 text-sm">Total Motif</p>
              <p className="text-3xl font-bold text-brown-900 mt-1">
                {stats.totalMotif}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-lime-600">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-brown-900 mb-4">Statistik Sistem</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-brown-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full">
            Tambah Sanggar
          </Button>
          <Button variant="outline" className="w-full">
            Tambah Produk
          </Button>
          <Button variant="outline" className="w-full">
            Kelola Wilayah
          </Button>
          <Button variant="outline" className="w-full">
            Lihat Review
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;