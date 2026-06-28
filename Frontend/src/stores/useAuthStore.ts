import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAdmin: boolean;
  isUser: boolean;
  token: string | null;
  userToken: string | null;
  userName: string | null;
  login: (token: string) => void;
  loginUser: (token: string, name: string) => void;
  logout: () => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      isUser: false,
      token: null,
      userToken: null,
      userName: null,
      login: (token) => {
        localStorage.setItem('adminToken', token);
        set({ isAdmin: true, token });
      },
      loginUser: (userToken, userName) => {
        localStorage.setItem('userToken', userToken);
        set({ isUser: true, userToken, userName });
      },
      logout: () => {
        localStorage.removeItem('adminToken');
        set({ isAdmin: false, token: null });
      },
      logoutUser: () => {
        localStorage.removeItem('userToken');
        set({ isUser: false, userToken: null, userName: null });
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);
