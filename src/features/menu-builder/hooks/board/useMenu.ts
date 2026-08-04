import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import toast from 'react-hot-toast';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import type { FullMenuResponse, ReorderItem } from '@/features/menu-builder/types/menu-board.types';

export const useMenu = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useActiveRestaurantId();

  const { data: menuData, isLoading } = useQuery<FullMenuResponse>({
    queryKey: QUERY_KEYS.fullMenu(restaurantId),
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return menuApi.getFullMenu();
    },
    enabled: !!restaurantId,
  });

  const categories = menuData?.categories || [];

  const invalidateAllMenuData = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dishesListAll(restaurantId) });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dishesLookup(restaurantId) });
  };

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return menuApi.createCategory({
        name,
        sortOrder: categories.length,
      });
    },
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

  const updateDishMutation = useMutation<
    Dish, 
    Error, 
    { id: string; data: Partial<DishFormValues> & { categoryId?: string; sortOrder?: number } },
    { previousMenu: FullMenuResponse | undefined }
  >({
    mutationFn: ({ id, data }) => menuApi.updateDish(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
      const previousMenu = queryClient.getQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId));

      if (previousMenu) {
        queryClient.setQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId), (old) => {
          if (!old) return old;

          const targetDish = old.categories
            .flatMap((cat) => cat.dishes || [])
            .find((d) => String(d.id) === String(id));

          if (!targetDish) return old;

          const updatedDish: Dish = { 
            ...targetDish, 
            ...data, 
            categoryId: data.categoryId ?? targetDish.categoryId 
          };

          const nextCategories = old.categories.map((cat) => {
            const nextDishes = cat.dishes ? cat.dishes.filter((d) => String(d.id) !== String(id)) : [];

            if (String(cat.id) === String(updatedDish.categoryId)) {
              const insertIndex = data.sortOrder !== undefined ? data.sortOrder : nextDishes.length;
              nextDishes.splice(insertIndex, 0, updatedDish);
            }

            return {
              ...cat,
              dishes: nextDishes.map((d, idx) => ({ ...d, sortOrder: idx })),
            };
          });

          return { ...old, categories: nextCategories };
        });
      }

      return { previousMenu };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMenu) {
        queryClient.setQueryData(QUERY_KEYS.fullMenu(restaurantId), context.previousMenu);
      }
    },
    onSettled: invalidateAllMenuData,
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
    mutationFn: (items: ReorderItem[]) => menuApi.reorderCategories(items),
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
      const previousMenu = queryClient.getQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId));

      queryClient.setQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId), (old) => {
        if (!old) return old;
        const updatedCategories = [...old.categories].sort((a, b) => {
          const indexA = newItems.findIndex(i => i.id === a.id);
          const indexB = newItems.findIndex(i => i.id === b.id);
          const posA = indexA === -1 ? Infinity : indexA;
          const posB = indexB === -1 ? Infinity : indexB;
          return posA - posB;
        });
        return { ...old, categories: updatedCategories };
      });

      return { previousMenu };
    },
    onError: (_err, _newItems, context) => {
      queryClient.setQueryData(QUERY_KEYS.fullMenu(restaurantId), context?.previousMenu);
    },
    onSettled: invalidateAllMenuData,
  });

  const reorderDishesMutation = useMutation<void, Error, ReorderItem[], { previousMenu: FullMenuResponse | undefined }>({
    mutationFn: (items: ReorderItem[]) => menuApi.reorderDishes(items),
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
      const previousMenu = queryClient.getQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId));

      queryClient.setQueryData<FullMenuResponse>(QUERY_KEYS.fullMenu(restaurantId), (old) => {
        if (!old) return old;
        const updatedCategories = old.categories.map((category) => {
          const updatedDishes = category.dishes ? category.dishes.map((dish) => {
            const item = newItems.find((i) => i.id === dish.id);
            return item ? { ...dish, sortOrder: item.sortOrder } : dish;
          }) : [];
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
      queryClient.setQueryData(QUERY_KEYS.fullMenu(restaurantId), context?.previousMenu);
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