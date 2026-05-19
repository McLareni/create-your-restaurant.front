import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/menu.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useMenuBoard = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const [localMenu, setLocalMenu] = useState<any>({ restaurantId, categories: [] });

  const { data: serverMenu, isLoading } = useQuery({
    queryKey: ['fullMenu', restaurantId],
    queryFn: () => menuApi.getFullMenu(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (serverMenu) {
      setLocalMenu(serverMenu);
    }
  }, [serverMenu]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => menuApi.saveMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu'] });
    },
  });

  const addCategory = (name: string) => {
    setLocalMenu((prev: any) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: `temp_cat_${Date.now()}`, name, sortOrder: prev.categories.length, dishes: [] }
      ]
    }));
  };

  const removeCategory = (categoryId: string) => {
    setLocalMenu((prev: any) => ({
      ...prev,
      categories: prev.categories.filter((c: any) => c.id !== categoryId)
    }));
  };

  const addDish = (categoryId: string, dish: any) => {
    setLocalMenu((prev: any) => ({
      ...prev,
      categories: prev.categories.map((c: any) => {
        if (c.id === categoryId) {
          return {
            ...c,
            dishes: [...(c.dishes || []), { id: `temp_dish_${Date.now()}`, ...dish }]
          };
        }
        return c;
      })
    }));
  };

  const removeDish = (categoryId: string, dishId: string) => {
    setLocalMenu((prev: any) => ({
      ...prev,
      categories: prev.categories.map((c: any) => {
        if (c.id === categoryId) {
          return {
            ...c,
            dishes: c.dishes.filter((d: any) => d.id !== dishId)
          };
        }
        return c;
      })
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(localMenu);
  };

  return {
    localMenu,
    isLoading,
    isSaving: saveMutation.isPending,
    addCategory,
    removeCategory,
    addDish,
    removeDish,
    handleSave
  };
};