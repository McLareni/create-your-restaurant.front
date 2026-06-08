'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '@/features/menu-builder/api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import toast from 'react-hot-toast';

export const useDishesList = () => {
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  return useQuery<Dish[]>({
    queryKey: ['dishes-list-all', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId!),
    enabled: !!restaurantId,
  });
};

export const useAvailableDishesList = (excludeDishId?: string) => {
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  const { data: dishes = [], isLoading } = useQuery<Dish[]>({
    queryKey: ['dishes-lookup', restaurantId],
    queryFn: () => dishesApi.getAll(restaurantId!),
    enabled: !!restaurantId,
  });

  const filteredDishes = dishes.filter((d) => d.id !== excludeDishId);

  return {
    dishes: filteredDishes,
    isLoading,
  };
};

export const useDishesLookups = (type: 'allergens' | 'tags') => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  const queryKey = [type === 'allergens' ? 'allergens-lookup-list' : 'dish-tags-lookup-list', restaurantId];

  const { data: items = [], isLoading } = useQuery<string[]>({
    queryKey,
    queryFn: () => type === 'allergens' ? dishesApi.getAllergensLookup(restaurantId!) : dishesApi.getTagsLookup(restaurantId!),
    enabled: !!restaurantId,
  });

  const createItem = useMutation({
    mutationFn: (name: string) => type === 'allergens' ? dishesApi.createAllergenLookup(restaurantId!, name) : dishesApi.createTagLookup(restaurantId!, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenSaveFailed' : 'menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  });

  const deleteItem = useMutation({
    mutationFn: (name: string) => type === 'allergens' ? dishesApi.deleteAllergenLookup(restaurantId!, name) : dishesApi.deleteTagLookup(restaurantId!, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error(t(type === 'allergens' ? 'menu.constructor.dishes.modal.errors.allergenDeleteFailed' : 'menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  });

  return {
    items,
    isLoading,
    createItem: createItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync,
  };
};