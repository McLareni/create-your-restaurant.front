'use client';

import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useActiveRestaurantId = (): number | null => {
  const activeId = useRestaurantStore((state) => state.activeRestaurant?.id);
  return activeId ? Number(activeId) : null;
};