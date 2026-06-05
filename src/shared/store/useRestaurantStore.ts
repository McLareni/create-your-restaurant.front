import { create } from 'zustand';

interface MinimalRestaurant {
  id: number;
  name: string;
  slug?: string;
}

interface RestaurantStoreState {
  activeRestaurant: MinimalRestaurant | null;
  setActiveRestaurant: (restaurant: MinimalRestaurant) => void;
  clearActiveRestaurant: () => void;
}

// Повна відмова від клієнтського localStorage для безпеки
export const useRestaurantStore = create<RestaurantStoreState>()((set) => ({
  activeRestaurant: null,
  setActiveRestaurant: (restaurant) => set({ activeRestaurant: restaurant }),
  clearActiveRestaurant: () => set({ activeRestaurant: null }),
}));