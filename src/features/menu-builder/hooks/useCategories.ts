import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Category, CreateCategoryDTO } from '../types/categories.types';
import { categoriesApi } from '../api/categories.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id;

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => 
      categoriesApi.create({
        ...data,
        restaurantId: Number(restaurantId),
        sortOrder: categories.length
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryDTO }) => categoriesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Category[]) => categoriesApi.reorder(items),
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousItems = queryClient.getQueryData(['categories']);
      queryClient.setQueryData(['categories'], newItems);
      return { previousItems };
    },
    onError: (err, newItems, context) => {
      queryClient.setQueryData(['categories'], context?.previousItems);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((item) => item.id === active.id);
      const newIndex = categories.findIndex((item) => item.id === over.id);
      const newArray = arrayMove(categories, oldIndex, newIndex).map(
        (item, index) => ({ ...item, sortOrder: index })
      );
      reorderMutation.mutate(newArray);
    }
  };

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    handleDragEnd
  };
};