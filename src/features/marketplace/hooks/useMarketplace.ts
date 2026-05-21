import { useState, useEffect } from 'react';
import { marketplaceApi } from '../api/marketplace.api';
import { MarketplaceModule } from '../types/marketplace.types';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useUserStore } from '@/shared/store/useUserStore';

export const useMarketplace = () => {
  const { hasModule } = useAccessStore();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);
  
  const [modules, setModules] = useState<MarketplaceModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      if (!restaurantId) return;
      setIsLoading(true);
      try {
        const data = await marketplaceApi.getModules(restaurantId);
        setModules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [restaurantId]);

  const connectModule = async (moduleKey: string) => {
    await marketplaceApi.connectModule(restaurantId, moduleKey);
  };

  return {
    modules,
    isLoading,
    hasModule,
    connectModule
  };
};