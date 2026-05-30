import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useAllergens = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: allergens = [] } = useQuery({
    queryKey: ['allergens-lookup-list', restaurantId],
    queryFn: () => dishesApi.getAllergensLookup(restaurantId),
    enabled: !!restaurantId,
  });

  const createAllergen = useMutation({
    mutationFn: (name: string) => dishesApi.createAllergenLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergens-lookup-list', restaurantId] });
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.allergenSaveFailed'));
    }
  });

  const deleteAllergen = useMutation({
    mutationFn: (name: string) => dishesApi.deleteAllergenLookup(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergens-lookup-list', restaurantId] });
    },
    onError: () => {
      toast.error(t('menu.constructor.dishes.modal.errors.allergenDeleteFailed'));
    }
  });

  return {
    allergens,
    createAllergen: createAllergen.mutateAsync,
    deleteAllergen: deleteAllergen.mutateAsync
  };
};