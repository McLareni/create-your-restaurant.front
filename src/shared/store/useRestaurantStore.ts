import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MinimalRestaurant {
  id: string | number;
  name: string;
  slug?: string;
  imageUrl?: string | null;
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
      name: 'gustio-active-restaurant',
    }
  )
);