import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '@/features/menu-builder/api/dishes.api';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { FullMenuResponse } from '@/features/menu-builder/types/menu-board.types';
import toast from 'react-hot-toast';

export const useDishesList = () => {
  const restaurantId = useActiveRestaurantId();
  return useQuery<FullMenuResponse, Error, Dish[]>({
    queryKey: QUERY_KEYS.fullMenu(restaurantId),
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return menuApi.getFullMenu();
    },
    enabled: !!restaurantId,
    select: (data) => data.categories?.flatMap((cat) => cat.dishes) || [],
  });
};

export const useAvailableDishesList = (excludeDishId?: string) => {
  const { data: dishes = [], isLoading } = useDishesList();
  const filteredDishes = dishes.filter((d) => d.id !== excludeDishId);
  return { dishes: filteredDishes, isLoading };
};

export const useDishesLookups = (type: 'allergens' | 'tags') => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useActiveRestaurantId();
  const queryKey = QUERY_KEYS.dishesLookup(restaurantId, type);

  const { data: items = [] } = useQuery<string[]>({
    queryKey,
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return type === 'allergens' ? dishesApi.getAllergensLookup() : dishesApi.getTagsLookup();
    },
    enabled: !!restaurantId,
  });

  const createItem = useMutation({
    mutationFn: (name: string) => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return type === 'allergens' ? dishesApi.createAllergenLookup(name) : dishesApi.createTagLookup(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenSaveFailed' : 'menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  });

  const deleteItem = useMutation({
    mutationFn: (name: string) => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return type === 'allergens' ? dishesApi.deleteAllergenLookup(name) : dishesApi.deleteTagLookup(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenDeleteFailed' : 'menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  });

  return {
    items,
    createItem: createItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync,
    isCreating: createItem.isPending,
    isDeleting: deleteItem.isPending,
  };
};