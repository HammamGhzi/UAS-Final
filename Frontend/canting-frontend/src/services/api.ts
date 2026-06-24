import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk tambah token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  
  // CRUD Produk
  getProducts: () => api.get('/admin/products'),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  
  // Master data
  getRegions: () => api.get('/admin/regions'),
  getCategories: () => api.get('/admin/categories'),
  getMotifs: () => api.get('/admin/motifs'),
  getReviews: () => api.get('/admin/reviews'),
};

export default api;