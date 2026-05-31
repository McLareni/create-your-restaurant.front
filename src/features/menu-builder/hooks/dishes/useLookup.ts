'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../../api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useLookup = (type: 'allergens' | 'tags') => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const queryKey = [type === 'allergens' ? 'allergens-lookup-list' : 'dish-tags-lookup-list', restaurantId];

  const { data: items = [] } = useQuery({
    queryKey,
    queryFn: () => type === 'allergens' ? dishesApi.getAllergensLookup(restaurantId) : dishesApi.getTagsLookup(restaurantId),
    enabled: !!restaurantId,
  });

  const createItem = useMutation({
    mutationFn: (name: string) => type === 'allergens' ? dishesApi.createAllergenLookup(restaurantId, name) : dishesApi.createTagLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenSaveFailed' : 'menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  });

  const deleteItem = useMutation({
    mutationFn: (name: string) => type === 'allergens' ? dishesApi.deleteAllergenLookup(restaurantId, name) : dishesApi.deleteTagLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenDeleteFailed' : 'menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  });

  return {
    items,
    createItem: createItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync
  };
};