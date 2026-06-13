'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/features/menu-builder/api/inventory.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import type { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '@/features/menu-builder/types/inventory.types';

export const useInventory = () => {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  const queryKey = ['inventory', restaurantId];

  const { data: inventoryItems = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey,
    queryFn: () => inventoryApi.getAll(restaurantId!),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryItemDTO) => inventoryApi.create(restaurantId!, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
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
    onError: (_err, _updatedItem, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(queryKey, context.previousInventory);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.delete(restaurantId!, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
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