import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory.api';
import { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '../../types/inventory.types';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useInventory = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const queryKey = ['inventory', restaurantId];

  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => inventoryApi.getAll(restaurantId!),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryItemDTO) => inventoryApi.create(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateInventoryItemDTO) => inventoryApi.update(restaurantId!, data),
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousInventory = queryClient.getQueryData<InventoryItem[]>(queryKey);
      if (previousInventory) {
        queryClient.setQueryData<InventoryItem[]>(
          queryKey,
          previousInventory.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
          )
        );
      }
      return { previousInventory };
    },
    onError: (err, updatedItem, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(queryKey, context.previousInventory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.delete(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    inventoryItems,
    isLoading: isLoading || restaurantId === null,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
  };
};