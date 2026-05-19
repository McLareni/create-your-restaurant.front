import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/menu.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useMenuBoard = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const { data: localMenu, isLoading } = useQuery({
    queryKey: ['fullMenu', restaurantId],
    queryFn: () => menuApi.getFullMenu(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => menuApi.createCategory({ restaurantId: Number(restaurantId), ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const createDishMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: any }) => menuApi.createDish(categoryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => menuApi.deleteCategory(categoryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  const deleteDishMutation = useMutation({
    mutationFn: (dishId: string) => menuApi.deleteDish(dishId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] }),
  });

  return {
    localMenu,
    isLoading,
    isSaving: createCategoryMutation.isPending || createDishMutation.isPending,
    addCategory: (name: string) => createCategoryMutation.mutate({ name, sortOrder: localMenu?.categories?.length || 0 }),
    removeCategory: (categoryId: string) => deleteCategoryMutation.mutate(categoryId),
    addDish: (categoryId: string, dish: any) => createDishMutation.mutate({ categoryId, data: dish }),
    removeDish: (dishId: string) => deleteDishMutation.mutate(dishId),
  };
};