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
      const user = await apiClient.get<User>('/users/me');
      set({ user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
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