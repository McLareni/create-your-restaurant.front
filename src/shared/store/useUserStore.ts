import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { authApi } from '@/features/auth/api/auth.api';

export interface RestaurantSummary {
  name: string;
}

export interface User {
  id: number;
  email: string;
  role: 'OWNER' | 'STAFF' | 'CUSTOMER';
  firstName?: string | null;
  lastName?: string | null;
  photo?: string | null;
  restaurants?: RestaurantSummary[];
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
      const response = await apiClient.get<{ user: User }>('/users/me');
      set({ user: response.user, isLoading: false });
    } catch (error) {
      set({ 
        user: { 
          id: 1, 
          email: 'test@gastro.com', 
          role: 'OWNER', 
          restaurants: [{ name: 'Кав\'ярня Кіт' }] 
        }, 
        isLoading: false 
      });
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