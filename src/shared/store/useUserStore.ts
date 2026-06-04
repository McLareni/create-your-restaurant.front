import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { authApi } from '@/features/auth/api/auth.api';

export interface RestaurantSummary {
  id: number; 
  name: string;
  slug?: string;
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
  fetchUser: (force?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

let fetchPromise: Promise<void> | null = null;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  
  fetchUser: async (force = false) => {
    if (get().user && !force) {
      set({ isLoading: false });
      return;
    }

    if (fetchPromise && !force) {
      await fetchPromise;
      return;
    }

    set({ isLoading: true });

    fetchPromise = (async () => {
      try {
        const response = await apiClient.get<{ user: User }>('/users/me');
        set({ user: response.user, isLoading: false });
      } catch (error) {
        if (!get().user) {
          set({ user: null, isLoading: false });
        }
      } finally {
        fetchPromise = null;
      }
    })();

    await fetchPromise;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Silent fail for network logout error:', error);
    } finally {
      set({ user: null });
      window.location.href = '/login';
    }
  }
}));