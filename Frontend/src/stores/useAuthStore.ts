import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAdmin: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      token: null,
      login: (token) => set({ isAdmin: true, token }),
      logout: () => set({ isAdmin: false, token: null }),
    }),
    {
      name: 'admin-auth',
    }
  )
);