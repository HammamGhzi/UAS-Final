import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type Role } from '../stores/useAuthStore';

type ProtectedRouteProps = {
  // Role mana saja yang boleh mengakses route ini.
  // Contoh: <ProtectedRoute allowedRoles={['admin']} />
  allowedRoles: Role[];
  // Kalau ditolak, redirect ke sini (default: /form/login)
  redirectTo?: string;
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/form/login',
}: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Belum login sama sekali -> tendang ke login
  if (!token || !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Sudah login, tapi role-nya bukan yang diizinkan untuk area ini
  // (misalnya admin sanggar coba buka /super-admin) -> tendang juga
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Lolos semua pengecekan -> render halaman anak (via <Outlet />)
  return <Outlet />;
}