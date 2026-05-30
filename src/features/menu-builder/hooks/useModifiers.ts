import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modifiersApi } from '../api/modifiers.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useModifiers = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['modifierGroups', restaurantId],
    queryFn: () => modifiersApi.getGroups(restaurantId),
    enabled: !!restaurantId,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['modifierGroups', restaurantId] });
    queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
  };

  const createGroupMutation = useMutation({
    mutationFn: (data: any) => modifiersApi.createGroup(restaurantId, data),
    onSuccess: invalidateAll,
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      modifiersApi.updateGroup(restaurantId, id, data),
    onSuccess: invalidateAll,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.deleteGroup(restaurantId, id),
    onSuccess: invalidateAll,
  });

  return {
    groups,
    isLoading,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
  };
};