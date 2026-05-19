import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dish, CreateDishDTO, UpdateDishDTO } from '../types/dishes.types';
import { dishesApi } from '../api/dishes.api';

export const useDishes = () => {
  const queryClient = useQueryClient();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateDishDTO }) => dishesApi.create(categoryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDishDTO }) => dishesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dishesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const bulkUpdatePricesMutation = useMutation({
    mutationFn: (updates: { id: string; price: number }[]) => dishesApi.bulkUpdatePrices(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  return {
    dishes,
    isLoading,
    createDish: createMutation.mutate,
    updateDish: updateMutation.mutate,
    deleteDish: deleteMutation.mutate,
    bulkUpdatePrices: bulkUpdatePricesMutation.mutate,
  };
};