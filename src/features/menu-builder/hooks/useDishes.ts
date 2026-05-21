import { useQuery } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useDishes = () => {
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);

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