import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useDishTags = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: tags = [] } = useQuery({
    queryKey: ['dish-tags-lookup-list', restaurantId],
    queryFn: () => dishesApi.getTagsLookup(restaurantId),
    enabled: !!restaurantId,
  });

  const createTag = useMutation({
    mutationFn: (name: string) => dishesApi.createTagLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dish-tags-lookup-list', restaurantId] });
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  });

  const deleteTag = useMutation({
    mutationFn: (name: string) => dishesApi.deleteTagLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dish-tags-lookup-list', restaurantId] });
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  });

  return {
    tags,
    createTag: createTag.mutateAsync,
    deleteTag: deleteTag.mutateAsync
  };
};