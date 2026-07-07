import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminSanggarLayout from '../components/layouts/AdminSanggarLayout';
import Home from '../pages/Home/Home';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import SanggarDetail from '../pages/SanggarDetail/SanggarDetail';
import Recommendation from '../pages/Recommendation/Recommendation';
import RecommendationResult from '../pages/RecommendationResult/RecommendationResult';
import AdminLogin from '../pages/admin/Login';
import AdminRegister from '../pages/admin/Register';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminSanggars from '../pages/admin/Sanggars';
import AdminProducts from '../pages/admin/Products';
import AdminRegions from '../pages/admin/Regions';
import AdminCategories from '../pages/admin/Categories.tsx';
import AdminMotifs from '../pages/admin/Motifs';
import AdminReviews from '../pages/admin/Reviews';
import AdminSanggarDashboard from '../pages/adminSanggar/Dashboard';
import AdminSanggarProducts from '../pages/adminSanggar/Products';
import AdminSanggarReviews from '../pages/adminSanggar/Reviews';
import AdminSanggarSettings from '../pages/adminSanggar/Settings';
import Katalog from '../pages/Katalog/Katalog';
import SuperAdminLayout from '../components/layouts/SuperAdminLayout';
import SuperAdminDashboard from '../pages/superAdmin/Dashboard';
import SuperAdminSanggarPage from '../pages/superAdmin/Sanggar';
import SuperAdminProdukPage from '../pages/superAdmin/Produk';
import SuperAdminReviewsPage from '../pages/superAdmin/Reviews';
import SuperAdminPenggunaPage from '../pages/superAdmin/Pengguna';
import ProtectedRoute from './ProtectedRoute';
import ProdukList from '../pages/ProdukList/ProdukList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
   children: [
  { index: true, element: <Home /> },
  { path: 'produk', element: <ProdukList /> },
  { path: 'produk/:id', element: <ProductDetail /> },
  { path: 'sanggar/:id', element: <SanggarDetail /> },
  { path: 'rekomendasi', element: <Recommendation /> },
  { path: 'rekomendasi/hasil', element: <RecommendationResult /> },
  { path: 'katalog', element: <Katalog /> },
],
  },
  {
    path: '/form',
    children: [
      { path: 'login', element: <AdminLogin /> },
      { path: 'register', element: <AdminRegister /> },
      {
        path: '',
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: '',
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'sanggars', element: <AdminSanggars /> },
              { path: 'products', element: <AdminProducts /> },
              { path: 'regions', element: <AdminRegions /> },
              { path: 'categories', element: <AdminCategories /> },
              { path: 'motifs', element: <AdminMotifs /> },
              { path: 'reviews', element: <AdminReviews /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/admin-sanggar',
    element: <ProtectedRoute allowedRoles={['admin-sanggar']} />,
    children: [
      {
        path: '',
        element: <AdminSanggarLayout />,
        children: [
          { index: true, element: <AdminSanggarDashboard /> },
          { path: 'products', element: <AdminSanggarProducts /> },
          { path: 'reviews', element: <AdminSanggarReviews /> },
          { path: 'settings', element: <AdminSanggarSettings /> },
        ],
      },
    ],
  },
  {
    path: '/super-admin',
    element: <ProtectedRoute allowedRoles={['super-admin']} />,
    children: [
      {
        path: '',
        element: <SuperAdminLayout />,
        children: [
          { index: true, element: <SuperAdminDashboard /> },
          { path: 'sanggar', element: <SuperAdminSanggarPage /> },
          { path: 'produk', element: <SuperAdminProdukPage /> },
          { path: 'reviews', element: <SuperAdminReviewsPage /> },
          { path: 'pengguna', element: <SuperAdminPenggunaPage /> },
        ],
      },
    ],
  },
]);