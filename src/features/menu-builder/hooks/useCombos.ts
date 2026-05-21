import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/shared/store/useUserStore';
import { combosApi } from '../api/combos.api';
import { Combo, CreateComboDTO } from '../types/combos.types';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useCombos = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);

  const { data: combos = [], isLoading } = useQuery<Combo[]>({
    queryKey: ['combos', restaurantId],
    queryFn: () => combosApi.getAll(restaurantId),
    enabled: !!restaurantId,
  });

  const createComboMutation = useMutation({
    mutationFn: (data: CreateComboDTO) => combosApi.create(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      toast.success(t('menu.constructor.combos.notifications.createSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.createError')),
  });

  const updateComboMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateComboDTO }) => 
      combosApi.update(restaurantId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      toast.success(t('menu.constructor.combos.notifications.updateSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.updateError')),
  });

  const deleteComboMutation = useMutation({
    mutationFn: (id: string) => combosApi.delete(restaurantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      toast.success(t('menu.constructor.combos.notifications.deleteSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.deleteError')),
  });

  return {
    combos,
    isLoading: isLoading || createComboMutation.isPending || updateComboMutation.isPending || deleteComboMutation.isPending,
    createCombo: createComboMutation.mutateAsync,
    updateCombo: updateComboMutation.mutateAsync,
    deleteCombo: deleteComboMutation.mutateAsync,
  };
};