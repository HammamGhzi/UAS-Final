import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Role ini HARUS sama persis dengan enum Role di schema.prisma backend
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);