import { useQuery } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useAvailableDishesList = (excludeDishId?: string) => {
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes-lookup', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  const filteredDishes = dishes.filter(d => d.id !== excludeDishId);

  return {
    dishes: filteredDishes,
    isLoading
  };
};