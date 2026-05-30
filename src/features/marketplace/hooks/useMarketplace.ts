import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../api/marketplace.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useMarketplace = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['marketplace-modules', restaurantId],
    queryFn: () => marketplaceApi.getModules(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const connectModuleMutation = useMutation({
    mutationFn: (moduleKey: string) => marketplaceApi.connectModule(restaurantId, moduleKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-modules', restaurantId] });
    },
  });

  return {
    modules,
    isLoading,
    connectModule: connectModuleMutation.mutateAsync,
  };
};