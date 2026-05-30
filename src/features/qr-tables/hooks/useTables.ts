import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../api/tables.api';
import { CreateTableDTO, UpdateTableDTO } from '../types/tables.types';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useUserStore } from '@/shared/store/useUserStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useTables = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const userRestaurants = useUserStore((state) => state.user?.restaurants);
  const restaurantId = Number(activeRestaurant?.id || 1);
  
  const restaurantSlug =
    activeRestaurant?.slug ||
    (userRestaurants || []).find((restaurant) => Number(restaurant.id) === restaurantId)?.slug;

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId, restaurantSlug),
    enabled: !!restaurantId,
  });

  const uniqueTypes = Array.from(new Set(tables.map(t => t.type)));

  const createMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('staff.notifications.createSuccess' as any) || 'Стіл успішно створено');
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) =>
      tablesApi.update(restaurantId, id, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('staff.notifications.updateSuccess' as any) || 'Параметри оновлено');
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tablesApi.delete(restaurantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('staff.notifications.deleteSuccess' as any) || 'Стіл видалено');
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  const isTableNumberUnique = (number: string, excludeId?: string) => {
    return !tables.some(t => t.tableNumber.toLowerCase() === number.toLowerCase() && t.id !== excludeId);
  };

  return {
    tables,
    isLoading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    uniqueTypes,
    isTableNumberUnique,
    createTable: createMutation.mutateAsync,
    updateTable: updateMutation.mutateAsync,
    deleteTable: deleteMutation.mutateAsync,
  };
};