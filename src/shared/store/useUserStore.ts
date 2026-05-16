import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { authApi } from '@/features/auth/api/auth.api';

export interface User {
  id: number;
  email: string;
  role: 'OWNER' | 'STAFF' | 'CUSTOMER';
  firstName?: string;
  lastName?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  
fetchUser: async () => {
    set({ isLoading: true });
    try {
      // Спробуємо сходити на бекенд
      const user = await apiClient.get<User>('/users/me');
      set({ user, isLoading: false });
    } catch (error) {
      // ⚠️ ТИМЧАСОВА ЗАГЛУШКА (доки не готовий бекенд):
      // Якщо бекенд видає 404, ми імітуємо успішну відповідь.
      const mockUser: User = {
        id: 1,
        email: 'test-admin@gastro.com',
        role: 'OWNER',
      };
      
      set({ user: mockUser, isLoading: false });
      
      // КОЛИ БЕКЕНД БУДЕ ГОТОВИЙ, ПОВЕРНИ ЦЕЙ РЯДОК ЗАМІСТЬ ЗАГЛУШКИ ВИЩЕ:
      // set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null });
      window.location.href = '/login';
    }
  }
}));