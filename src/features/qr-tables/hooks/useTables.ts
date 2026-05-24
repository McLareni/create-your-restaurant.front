import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../api/tables.api';
import { CreateTableDTO, UpdateTableDTO } from '../types/tables.types';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useUserStore } from '@/shared/store/useUserStore';

export const useTables = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const userRestaurants = useUserStore((state) => state.user?.restaurants || []);
  const restaurantId = Number(activeRestaurant?.id || 1);
  const restaurantSlug =
    activeRestaurant?.slug ||
    userRestaurants.find((restaurant) => Number(restaurant.id) === restaurantId)?.slug;

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId, restaurantSlug),
    enabled: !!restaurantId,
  });

  const uniqueTypes = Array.from(new Set(tables.map(t => t.type)));

  const createMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId, data, restaurantSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) =>
      tablesApi.update(restaurantId, id, data, restaurantSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tablesApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  });

  const isTableNumberUnique = (number: string, excludeId?: string) => {
    return !tables.some(t => t.tableNumber.toLowerCase() === number.toLowerCase() && t.id !== excludeId);
  };

  return {
    tables,
    isLoading,
    uniqueTypes,
    isTableNumberUnique,
    createTable: createMutation.mutate,
    updateTable: updateMutation.mutate,
    deleteTable: deleteMutation.mutate,
  };
};