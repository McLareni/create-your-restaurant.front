import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Combo, CreateComboDTO, UpdateComboDTO } from '../types/combos.types';
import { combosApi } from '../api/combos.api';

export const useCombos = () => {
  const queryClient = useQueryClient();

  const { data: combos = [], isLoading } = useQuery({
    queryKey: ['combos'],
    queryFn: combosApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateComboDTO) => combosApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComboDTO }) => combosApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => combosApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['combos'] }),
  });

  return {
    combos,
    isLoading,
    createCombo: createMutation.mutate,
    updateCombo: updateMutation.mutate,
    deleteCombo: deleteMutation.mutate,
  };
};