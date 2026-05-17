import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { Dish, ProductionZone } from '../types/dishes.types';

// Тимчасові типи для оптимістичних оновлень
type InventoryUpdateDTO = {
  id: string;
  isAvailable?: boolean;
  stockQuantity?: number | null;
  productionZone?: ProductionZone | null;
};

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, ...data }: InventoryUpdateDTO) => dishesApi.update(id, data),
    
    // OPTIMISTIC UPDATE
    onMutate: async (updatedItem) => {
      // 1. Скасовуємо активні запити, щоб вони не переписали наш оптимістичний стейт
      await queryClient.cancelQueries({ queryKey: ['dishes'] });

      // 2. Зберігаємо попередній стан (для Rollback)
      const previousDishes = queryClient.getQueryData<Dish[]>(['dishes']);

      // 3. Миттєво оновлюємо кеш новими даними
      if (previousDishes) {
        queryClient.setQueryData<Dish[]>(
          ['dishes'], 
          previousDishes.map(dish => 
            dish.id === updatedItem.id ? { ...dish, ...updatedItem } : dish
          )
        );
      }

      // 4. Повертаємо контекст з попередніми даними
      return { previousDishes };
    },
    
    // ЯКЩО ПОМИЛКА — РОБИМО ROLLBACK
    onError: (err, updatedItem, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(['dishes'], context.previousDishes);
      }
      // Тут можна додати toast-сповіщення: "Помилка оновлення стоп-листа"
    },
    
    // У будь-якому випадку синхронізуємося з сервером після завершення
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  return {
    dishes,
    isLoading,
    updateInventory: updateInventoryMutation.mutate,
  };
};