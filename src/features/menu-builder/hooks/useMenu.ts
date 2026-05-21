import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/menu.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useMenu = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: menuData, isLoading } = useQuery({
    queryKey: ['fullMenu', restaurantId],
    queryFn: () => menuApi.getFullMenu(restaurantId),
    enabled: !!restaurantId,
  });

  const categories = menuData?.categories || [];

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      menuApi.createCategory({
        restaurantId: restaurantId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes-lookup', restaurantId] });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => menuApi.updateDish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes-lookup', restaurantId] });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id: string) => menuApi.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['dishes-lookup', restaurantId] });
    },
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: (items: any[]) => menuApi.reorderCategories(items),
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
    mutationFn: (items: { id: string; sortOrder: number }[]) => menuApi.reorderDishes(items),
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ['fullMenu', restaurantId] });
      const previousMenu = queryClient.getQueryData(['fullMenu', restaurantId]);

      queryClient.setQueryData(['fullMenu', restaurantId], (old: any) => {
        if (!old) return old;
        
        const updatedCategories = old.categories.map((category: any) => {
          const updatedDishes = category.dishes.map((dish: any) => {
            const item = newItems.find((i) => i.id === dish.id);
            return item ? { ...dish, sortOrder: item.sortOrder } : dish;
          });
          
          return {
            ...category,
            dishes: updatedDishes.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)),
          };
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