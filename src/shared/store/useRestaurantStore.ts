import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MinimalRestaurant {
  id: number | string;
  name: string;
  slug?: string;
}

interface RestaurantStoreState {
  activeRestaurant: MinimalRestaurant | null;
  setActiveRestaurant: (restaurant: MinimalRestaurant) => void;
  clearActiveRestaurant: () => void;
}

export const useRestaurantStore = create<RestaurantStoreState>()(
  persist(
    (set) => ({
      activeRestaurant: null,
      setActiveRestaurant: (restaurant) => set({ activeRestaurant: restaurant }),
      clearActiveRestaurant: () => set({ activeRestaurant: null }),
    }),
    {
      name: 'gustio_active_restaurant',
      storage: createJSONStorage(() => localStorage),
    }
  )
);