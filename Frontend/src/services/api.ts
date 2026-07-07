import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: ambil token dari Zustand (bukan localStorage langsung),
// karena Zustand adalah satu-satunya sumber kebenaran untuk auth state.
// useAuthStore.getState() dipakai karena file ini di luar React component,
// jadi kita tidak bisa pakai hook useAuthStore((state) => ...) biasa.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: kalau backend nanti balas 401 (token expired/invalid),
// otomatis bersihkan auth state dan kasih sinyal ke aplikasi bahwa user
// harus diarahkan ke login lagi. ProtectedRoute akan otomatis redirect
// begitu isAuthenticated berubah jadi false.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      useAuthStore.getState().logoutUser();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// API Methods
export const produkApi = {
  getAll: (params?: any) => api.get('/produk', { params }),
  getById: (id: string) => api.get(`/produk/${id}`),
  getByKategori: (kategori: string) => api.get(`/produk/kategori/${kategori}`),
};

export const sanggarApi = {
  getAll: () => api.get('/sanggar'),
  getById: (id: string) => api.get(`/sanggar/${id}`),
  getRekomendasi: () => api.get('/sanggar/rekomendasi'),
};

export const reviewApi = {
  getByProduk: (produkId: string) => api.get(`/review/produk/${produkId}`),
  create: (data: any) => api.post('/review', data),
};

export const rekomendasiApi = {
  getRekomendasi: (params: any) => api.post('/rekomendasi', params),
};

export const adminApi = {
  login: (credentials: any) => api.post('/admin/login', credentials),
  getDashboard: () => api.get('/admin/dashboard'),
  
  // CRUD Sanggar
  getSanggars: () => api.get('/admin/sanggars'),
  createSanggar: (data: any) => api.post('/admin/sanggars', data),
  updateSanggar: (id: string, data: any) => api.put(`/admin/sanggars/${id}`, data),
  deleteSanggar: (id: string) => api.delete(`/admin/sanggars/${id}`),
  
  // Master data
  getRegions: () => api.get('/admin/regions'),
  getCategories: () => api.get('/admin/categories'),
  getMotifs: () => api.get('/admin/motifs'),
  getReviews: () => api.get('/admin/reviews'),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getProducts: () => api.get('/admin/products'),
};
// CRUD Batik Category — konek langsung ke backend batikCategoryController.ts
export const batikCategoryApi = {
  getAll: () => api.get('/batik-categories'),
  getById: (id: number) => api.get(`/batik-categories/${id}`),
  create: (data: { categoryName: string }) => api.post('/batik-categories', data),
  update: (id: number, data: { categoryName: string }) =>
    api.put(`/batik-categories/${id}`, data),
  delete: (id: number) => api.delete(`/batik-categories/${id}`),
};
// Auth API — konek ke authController.ts backend
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};
export default api;