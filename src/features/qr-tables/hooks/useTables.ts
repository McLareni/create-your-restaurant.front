import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../api/tables.api';
import { CreateTableDTO, UpdateTableDTO } from '../types/tables.types';

export const useTables = () => {
  const queryClient = useQueryClient();
  const restaurantSlug = 'my-cafe'; 

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: tablesApi.getAll,
  });

  const uniqueTypes = Array.from(new Set(tables.map(t => t.type)));

  const createMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(data, restaurantSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) => tablesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tablesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] }),
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