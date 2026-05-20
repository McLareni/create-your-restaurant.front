import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../api/tables.api';
import { CreateTableDTO, UpdateTableDTO } from '../types/tables.types';
import { useUserStore } from '@/shared/store/useUserStore';

export const useTables = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);
  const restaurantSlug = user?.restaurants?.[0]?.name?.toLowerCase().replace(/[\s_]+/g, '-') || 'my-cafe';

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  const uniqueTypes = Array.from(new Set(tables.map(t => t.type)));

  const createMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId, data, restaurantSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) => tablesApi.update(restaurantId, id, data),
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