// src/features/qr-tables/hooks/useTables.ts
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
  
  // Атомарні селектори для запобігання зайвих ререндерів
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const userRestaurants = useUserStore((state) => state.user?.restaurants);
  
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : 1;
  
  const restaurantSlug =
    activeRestaurant?.slug ||
    (userRestaurants || []).find((restaurant) => Number(restaurant.id) === restaurantId)?.slug;

  // Отримання списку столів
  const { data: tables = [], isLoading: isTablesLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId, restaurantSlug),
    enabled: !isNaN(restaurantId),
  });

  // Отримання списку зон закладу
  const { data: zones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ['zones', restaurantId],
    queryFn: () => tablesApi.getAllZones(restaurantId),
    enabled: !isNaN(restaurantId),
  });

  // Мутація: Створення столу
  const createMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('qr.notifications.createSuccess'));
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  // Мутація: Оновлення столу
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) =>
      tablesApi.update(restaurantId, id, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('qr.notifications.updateSuccess'));
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  // Мутація: Видалення столу
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tablesApi.delete(restaurantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      toast.success(t('qr.notifications.deleteSuccess'));
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  // Мутація: Створення нової локації/зони
  const createZoneMutation = useMutation({
    mutationFn: (name: string) => tablesApi.createZone(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones', restaurantId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('auth.errors.defaultError'));
    }
  });

  // Перевірка унікальності номера столу на клієнті
  const isTableNumberUnique = (number: string, excludeId?: string) => {
    return !tables.some(
      (t) => t.tableNumber.toLowerCase() === number.toLowerCase() && t.id !== excludeId
    );
  };

  return {
    tables,
    zones,
    isLoading: 
      isTablesLoading || 
      isZonesLoading || 
      createMutation.isPending || 
      updateMutation.isPending || 
      deleteMutation.isPending || 
      createZoneMutation.isPending,
    isTableNumberUnique,
    createTable: createMutation.mutateAsync,
    updateTable: updateMutation.mutateAsync,
    deleteTable: deleteMutation.mutateAsync,
    createZone: createZoneMutation.mutateAsync,
  };
};