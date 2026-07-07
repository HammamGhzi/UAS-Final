import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type Role } from '../stores/useAuthStore';

type ProtectedRouteProps = {
  allowedRoles: Role[];
  redirectTo?: string;
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/form/login',
}: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!token || !isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}