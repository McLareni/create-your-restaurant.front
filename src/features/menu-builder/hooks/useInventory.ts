import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { Dish, ProductionZone } from '../types/dishes.types';
import { useUserStore } from '@/shared/store/useUserStore';

type InventoryUpdateDTO = {
  id: string;
  isAvailable?: boolean;
  stockQuantity?: number | null;
  productionZone?: ProductionZone | null;
};

export const useInventory = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, ...data }: InventoryUpdateDTO) => dishesApi.update(id, data),
    
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ['dishes', restaurantId] });
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      await queryClient.cancelQueries({ queryKey: ['dishes-lookup', restaurantId] });

      const previousDishes = queryClient.getQueryData<Dish[]>(['dishes', restaurantId]);

      if (previousDishes) {
        queryClient.setQueryData<Dish[]>(
          ['dishes', restaurantId], 
          previousDishes.map(dish => 
            dish.id === updatedItem.id ? { ...dish, ...updatedItem } : dish
          )
        );
      }

      return { previousDishes };
    },
    
    onError: (err, updatedItem, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(['dishes', restaurantId], context.previousDishes);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes-lookup', restaurantId] });
    },
  });

  return {
    dishes,
    isLoading,
    updateInventory: updateInventoryMutation.mutate,
  };
};