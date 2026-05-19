import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modifiersApi } from '../api/modifiers.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useModifiers = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['modifierGroups', restaurantId],
    queryFn: () => modifiersApi.getGroups(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: any) => modifiersApi.createGroup(Number(restaurantId), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifierGroups', restaurantId] }),
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => modifiersApi.updateGroup(Number(restaurantId), id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifierGroups', restaurantId] }),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.deleteGroup(Number(restaurantId), id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifierGroups', restaurantId] }),
  });

  return {
    groups,
    isLoading,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
  };
};