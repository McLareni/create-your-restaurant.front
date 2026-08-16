import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './useUserStore';

interface MinimalRestaurant {
  id: string | number;
  name: string;
  slug?: string;
  imageUrl?: string | null;
  currency?: string | null;
}

interface RestaurantStoreState {
  activeRestaurant: MinimalRestaurant | null;
  setActiveRestaurant: (restaurant: MinimalRestaurant) => void;
  clearActiveRestaurant: () => void;
}

export const useRestaurantCurrency = (restaurantId?: string | number) => {
  const activeCurrency = useRestaurantStore((state) => state.activeRestaurant?.currency ?? null);
  const userCurrency = useUserStore((state) => {
    if (!restaurantId) return null;
    return state.user?.restaurants?.find((restaurant) => String(restaurant.id) === String(restaurantId))?.currency ?? null;
  });

  return activeCurrency ?? userCurrency ?? null;
};

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