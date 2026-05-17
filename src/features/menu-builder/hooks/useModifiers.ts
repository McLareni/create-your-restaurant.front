import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModifierGroup, CreateModifierDTO, UpdateModifierDTO } from '../types/modifiers.types';
import { modifiersApi } from '../api/modifiers.api';

export const useModifiers = () => {
  const queryClient = useQueryClient();

  const { data: modifiers = [], isLoading } = useQuery({
    queryKey: ['modifiers'],
    queryFn: modifiersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateModifierDTO) => modifiersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModifierDTO }) => modifiersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] }),
  });

  return {
    modifiers,
    isLoading,
    createModifier: createMutation.mutate,
    updateModifier: updateMutation.mutate,
    deleteModifier: deleteMutation.mutate,
  };
};