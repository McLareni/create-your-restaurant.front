import { create } from 'zustand';

interface MinimalRestaurant {
  id: number;
  name: string;
  slug?: string;
  imageUrl?: string | null;
}

interface RestaurantStoreState {
  activeRestaurant: MinimalRestaurant | null;
  setActiveRestaurant: (restaurant: MinimalRestaurant) => void;
  clearActiveRestaurant: () => void;
}

export const useRestaurantStore = create<RestaurantStoreState>()((set) => ({
  activeRestaurant: null,
  setActiveRestaurant: (restaurant) => set({ activeRestaurant: restaurant }),
  clearActiveRestaurant: () => set({ activeRestaurant: null }),
}));