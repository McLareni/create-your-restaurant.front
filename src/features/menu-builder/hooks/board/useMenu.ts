import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import type { FullMenuResponse, ReorderItem } from '@/features/menu-builder/types/menu-board.types';

export const useMenu = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  const { data: menuData, isLoading } = useQuery<FullMenuResponse>({
    queryKey: ['fullMenu', restaurantId],
    queryFn: () => menuApi.getFullMenu(restaurantId!),
    enabled: !!restaurantId,
  });

  const categories = menuData?.categories || [];

  const invalidateAllMenuData = () => {
    void queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
    void queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
  };

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      menuApi.createCategory({
        restaurantId: restaurantId!,
        name,
        sortOrder: categories.length,
      }),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.categories.notifications.createSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.categories.notifications.createError'));
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => menuApi.updateCategory(id, { name }),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.categories.notifications.updateSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.categories.notifications.updateError'));
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => menuApi.deleteCategory(id),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.categories.notifications.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.categories.notifications.deleteError'));
    },
  });

  const createDishMutation = useMutation<Dish, Error, { categoryId: string; data: DishFormValues }>({
    mutationFn: ({ categoryId, data }) => menuApi.createDish(categoryId, data),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.dishes.modal.notifications.createSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.unknown'));
    },
  });

  const updateDishMutation = useMutation<Dish, Error, { id: string; data: Partial<DishFormValues> & { categoryId?: string; sortOrder?: number } }>({
    mutationFn: ({ id, data }) => menuApi.updateDish(id, data),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.dishes.modal.notifications.updateSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.unknown'));
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id: string) => menuApi.deleteDish(id),
    onSuccess: () => {
      invalidateAllMenuData();
      toast.success(t('menu.constructor.dishes.notifications.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.notifications.deleteError'));
    },
  });

  const reorderCategoriesMutation = useMutation<void, Error, ReorderItem[], { previousMenu: FullMenuResponse | undefined }>({
    mutationFn: async (items: ReorderItem[]) => {
      await menuApi.reorderCategories(items);
    },
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      const previousMenu = queryClient.getQueryData<FullMenuResponse>(['fullMenu', restaurantId]);

      queryClient.setQueryData<FullMenuResponse>(['fullMenu', restaurantId], (old) => {
        if (!old) return old;
        const updatedCategories = [...old.categories].sort((a, b) => {
          const indexA = newItems.findIndex(i => i.id === a.id);
          const indexB = newItems.findIndex(i => i.id === b.id);
          return indexA - indexB;
        });
        return { ...old, categories: updatedCategories };
      });

      return { previousMenu };
    },
    onError: (_err, _newItems, context) => {
      queryClient.setQueryData(['fullMenu', restaurantId], context?.previousMenu);
    },
    onSettled: invalidateAllMenuData,
  });

  const reorderDishesMutation = useMutation<void, Error, ReorderItem[], { previousMenu: FullMenuResponse | undefined }>({
    mutationFn: async (items: ReorderItem[]) => {
      await menuApi.reorderDishes(items);
    },
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      const previousMenu = queryClient.getQueryData<FullMenuResponse>(['fullMenu', restaurantId]);

      queryClient.setQueryData<FullMenuResponse>(['fullMenu', restaurantId], (old) => {
        if (!old) return old;
        const updatedCategories = old.categories.map((category) => {
          const updatedDishes = category.dishes.map((dish) => {
            const item = newItems.find((i) => i.id === dish.id);
            return item ? { ...dish, sortOrder: item.sortOrder } : dish;
          });
          return {
            ...category,
            dishes: updatedDishes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
          };
        });
        return { ...old, categories: updatedCategories };
      });

      return { previousMenu };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['fullMenu', restaurantId], context?.previousMenu);
    },
    onSettled: invalidateAllMenuData,
  });

  return {
    categories,
    isLoading: isLoading || restaurantId === null,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    createDish: createDishMutation.mutate,
    createDishAsync: createDishMutation.mutateAsync,
    updateDish: updateDishMutation.mutate,
    updateDishAsync: updateDishMutation.mutateAsync,
    deleteDish: deleteDishMutation.mutate,
    reorderCategories: reorderCategoriesMutation.mutate,
    reorderDishes: reorderDishesMutation.mutate,
  };
};