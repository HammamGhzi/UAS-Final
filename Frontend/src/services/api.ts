import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor membaca token dari Zustand (bukan localStorage langsung),
// karena file ini di luar React component, jadi pakai getState() bukan hook.
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Kalau backend balas 401 (token expired/invalid), otomatis logout
// dan kasih sinyal ke aplikasi supaya user diarahkan ke login lagi.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Auth API — konek ke authController.ts backend
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  verifyOtp: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
};
// CRUD User — untuk Super Admin kelola akun ADMIN & USER
// CRUD User — untuk Super Admin kelola akun SUPER_ADMIN, ADMIN (sanggar), & USER
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; role?: string }) =>
    api.post('/users', data),
  update: (id: number, data: { email?: string; password?: string; role?: string }) =>
    api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// CRUD Batik Category — konek ke batikCategoryController.ts backend
export const batikCategoryApi = {
  getAll: () => api.get('/batik-categories'),
  getById: (id: number) => api.get(`/batik-categories/${id}`),
  create: (data: { categoryName: string }) => api.post('/batik-categories', data),
  update: (id: number, data: { categoryName: string }) =>
    api.put(`/batik-categories/${id}`, data),
  delete: (id: number) => api.delete(`/batik-categories/${id}`),
};

// API Methods lain yang sudah ada sebelumnya
export const produkApi = {
  getAll: (params?: any) => api.get('/produk', { params }),
  getById: (id: string) => api.get(`/produk/${id}`),
  getByKategori: (kategori: string) => api.get(`/produk/kategori/${kategori}`),
};

// CRUD Sanggar (list/delete dipakai Super Admin) — konek ke sanggarController.ts backend
// Catatan: mount point backend-nya '/sanggars' (jamak), bukan '/sanggar'.
export const sanggarApi = {
  getAll: () => api.get('/sanggars'),
  getById: (id: string | number) => api.get(`/sanggars/${id}`),
  update: (id: string | number, data: Record<string, unknown>) => api.put(`/sanggars/${id}`, data),
  delete: (id: string | number) => api.delete(`/sanggars/${id}`),
  getRekomendasi: () => api.get('/sanggars/rekomendasi'),
};
export const reviewApi = {
  create: (data: {
    productId: number;
    userId?: number | null;
    reviewerName: string;
    quality: number;
    popularity: number;
    design: number;
    comment?: string;
  }) => api.post('/reviews', data),
};
export const rekomendasiApi = {
  getRekomendasi: (params: any) => api.post('/rekomendasi', params),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSanggars: () => api.get('/admin/sanggars'),
  createSanggar: (data: any) => api.post('/admin/sanggars', data),
  updateSanggar: (id: string, data: any) => api.put(`/admin/sanggars/${id}`, data),
  deleteSanggar: (id: string) => api.delete(`/admin/sanggars/${id}`),
  getRegions: () => api.get('/admin/regions'),
  getCategories: () => api.get('/admin/categories'),
  getMotifs: () => api.get('/admin/motifs'),
  getReviews: () => api.get('/admin/reviews'),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getProducts: () => api.get('/admin/products'),
};
export const mySanggarApi = {
  getMine: () => api.get('/sanggars/me'),
  create: (data: Record<string, unknown>) => api.post('/sanggars', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/sanggars/${id}`, data),
};

export const regionApi = {
  getAll: () => api.get('/regions'),
  create: (data: { name: string }) => api.post('/regions', data),
  update: (id: number, data: { name: string }) => api.put(`/regions/${id}`, data),
  delete: (id: number) => api.delete(`/regions/${id}`),
};
export const productApi = {
  getAll: (params?: {
    sanggarId?: number;
    regionId?: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get('/products', params ? { params } : undefined),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: Record<string, unknown>) => api.post('/products', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Weight History — bikin bobot SPK dari 2 dropdown kriteria yang dipilih user
// di halaman Katalog (kriteria dipilih = bobot 5, kriteria lain = bobot 1)
export const weightHistoryApi = {
  create: (data: { kriteriaUtama: string; kriteriaKedua?: string | null }) =>
    api.post('/weight-histories', data),
};

// Recommendation (TOPSIS) — endpoint publik dipanggil dari tombol "Cari"
// di halaman Katalog untuk menjalankan SPK yang sebenarnya
export const recommendationApi = {
  run: (data: {
    sessionId: string;
    userId?: number | null;
    regionId?: number | null;
    categoryId?: number | null;
    minPrice?: number;
    maxPrice?: number;
    userLat: number;
    userLon: number;
    weightHistoryId: number;
  }) => api.post('/recommendations/run', data),
};

export const myReviewApi = {
  getMine: () => api.get('/reviews/mine'),
};

// Dashboard Super Admin — konek ke dashboardController.ts backend
export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
};
export default api;