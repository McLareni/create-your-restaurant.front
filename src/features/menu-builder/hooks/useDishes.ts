import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dish, CreateDishDTO, UpdateDishDTO } from '../types/dishes.types';
import { dishesApi } from '../api/dishes.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useDishes = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateDishDTO }) => dishesApi.create(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDishDTO }) => dishesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dishesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
    },
  });

  return {
    dishes,
    isLoading,
    createDish: createMutation.mutate,
    updateDish: updateMutation.mutate,
    deleteDish: deleteMutation.mutate,
  };
};