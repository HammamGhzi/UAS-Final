import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Role dipisah biar ProtectedRoute bisa tau halaman mana buat siapa.
// 'user' = pengunjung/customer yang login biasa.
export type Role = 'admin' | 'admin-sanggar' | 'super-admin' | 'user';

interface AuthState {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  userName: string | null;

  // Flag ini dipertahankan supaya komponen lama (MainLayout, dll)
  // yang sudah pakai isAdmin / isUser gak perlu diubah.
  isAdmin: boolean;
  isUser: boolean;

  login: (token: string, role: 'admin' | 'admin-sanggar' | 'super-admin') => void;
  loginUser: (token: string, name: string) => void;
  logout: () => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,
      userName: null,
      isAdmin: false,
      isUser: false,

      // Dipanggil setelah login admin / admin-sanggar / super-admin berhasil.
      // NOTE: gak perlu localStorage.setItem manual lagi, middleware `persist`
      // di bawah yang otomatis simpan semua state ini ke localStorage.
      login: (token, role) => {
        set({
          token,
          role,
          isAuthenticated: true,
          isAdmin: true,
          isUser: false,
          userName: null,
        });
      },

      // Dipanggil setelah login customer/user biasa berhasil.
      loginUser: (token, name) => {
        set({
          token,
          role: 'user',
          isAuthenticated: true,
          isAdmin: false,
          isUser: true,
          userName: name,
        });
      },

      logout: () => {
        set({
          token: null,
          role: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      logoutUser: () => {
        set({
          token: null,
          role: null,
          isAuthenticated: false,
          isUser: false,
          userName: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);