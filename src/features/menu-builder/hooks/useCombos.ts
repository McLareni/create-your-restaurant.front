import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Combo, CreateComboDTO, UpdateComboDTO } from '../types/combos.types';
import { combosApi } from '../api/combos.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useCombos = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const { data: combos = [], isLoading } = useQuery({
    queryKey: ['combos', restaurantId],
    queryFn: () => combosApi.getAll(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateComboDTO) => combosApi.create(Number(restaurantId), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComboDTO }) => combosApi.update(Number(restaurantId), id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => combosApi.delete(Number(restaurantId), id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] }),
  });

  return {
    combos,
    isLoading,
    createCombo: createMutation.mutate,
    updateCombo: updateMutation.mutate,
    deleteCombo: deleteMutation.mutate,
  };
};