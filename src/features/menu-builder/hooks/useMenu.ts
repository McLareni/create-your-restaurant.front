import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/menu.api';
import { categoriesApi } from '../api/categories.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useMenu = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const { data: menuData, isLoading } = useQuery({
    queryKey: ['fullMenu', restaurantId],
    queryFn: () => menuApi.getFullMenu(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  const categories = menuData?.categories || [];

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      menuApi.createCategory({
        restaurantId: Number(restaurantId),
        name,
        sortOrder: categories.length,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => menuApi.updateCategory(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => menuApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const createDishMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: any }) => menuApi.createDish(categoryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => menuApi.updateDish(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id: string) => menuApi.deleteDish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: (items: any[]) => categoriesApi.reorder(items),
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      const previousMenu = queryClient.getQueryData(['fullMenu', restaurantId]);

      queryClient.setQueryData(['fullMenu', restaurantId], (old: any) => {
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
    onError: (err, newItems, context) => {
      queryClient.setQueryData(['fullMenu', restaurantId], context?.previousMenu);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
    },
  });

  const reorderDishesMutation = useMutation({
    mutationFn: async ({ categoryId, items }: { categoryId: string; items: any[] }) => {
      return items; 
    },
    onMutate: async ({ categoryId, items }) => {
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      const previousMenu = queryClient.getQueryData(['fullMenu', restaurantId]);

      queryClient.setQueryData(['fullMenu', restaurantId], (old: any) => {
        if (!old) return old;
        const updatedCategories = old.categories.map((c: any) => {
          if (c.id === categoryId) {
            const updatedDishes = [...c.dishes].sort((a: any, b: any) => {
              return items.findIndex(i => i.id === a.id) - items.findIndex(i => i.id === b.id);
            });
            return { ...c, dishes: updatedDishes };
          }
          return c;
        });
        return { ...old, categories: updatedCategories };
      });

      return { previousMenu };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['fullMenu', restaurantId], context?.previousMenu);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    createDish: createDishMutation.mutate,
    updateDish: updateDishMutation.mutate,
    deleteDish: deleteDishMutation.mutate,
    reorderCategories: reorderCategoriesMutation.mutate,
    reorderDishes: reorderDishesMutation.mutate,
  };
};