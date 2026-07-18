'use client';

import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { authApi } from '@/features/auth/api/auth.api';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  activeFetchPromise: Promise<void> | null;
  setUser: (user: User | null) => void;
  fetchUser: (force?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  activeFetchPromise: null,

  setUser: (user) => set({ user }),

  fetchUser: async (force = false) => {
    if (get().user && !force) {
      set({ isLoading: false });
      return;
    }

    const currentPromise = get().activeFetchPromise;
    if (currentPromise && !force) {
      await currentPromise;
      return;
    }

    const newPromise = (async () => {
      try {
        const response = await apiClient.get<{ user: User }>('/users/me');
        set({ user: response.user, isLoading: false });
      } catch {
        if (!get().user) {
          set({ user: null, isLoading: false });
        }
      } finally {
        set({ activeFetchPromise: null });
      }
    })();

    set({ activeFetchPromise: newPromise, isLoading: !get().user });
    await newPromise;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      set({ user: null });
    } finally {
      set({ user: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
}));