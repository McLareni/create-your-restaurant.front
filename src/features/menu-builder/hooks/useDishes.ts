import { useQuery } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useDishes = () => {
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes-list-all', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  return {
    dishes,
    isLoading,
  };
};