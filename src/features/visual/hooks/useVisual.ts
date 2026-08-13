import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visualApi } from '../api/visual.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { VisualSettings } from '@/shared/config/visual.constants';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';

export const useVisual = () => {
  const queryClient = useQueryClient();
  const currentRestaurantId = useRestaurantStore((state) => state.activeRestaurant?.id) as number | undefined;
  const { t } = useTranslation();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['visual-settings', currentRestaurantId],
    queryFn: () => visualApi.getSettings(currentRestaurantId!),
    enabled: !!currentRestaurantId,
  });

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<VisualSettings>) =>
      visualApi.updateSettings(currentRestaurantId!, data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['visual-settings', currentRestaurantId], updatedSettings);
      toast.success(t('visual.saveSuccess'));
    },
    onError: () => {
      toast.error(t('visual.saveError'));
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
    isUpdating,
  };
};
