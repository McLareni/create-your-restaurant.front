import { useState, useEffect } from 'react';
import { marketplaceApi } from '../api/marketplace.api';
import { MarketplaceModule } from '../types/marketplace.types';
import { useAccessStore } from '@/shared/store/useAccessStore';

export const useMarketplace = () => {
  const { hasModule } = useAccessStore();
  const [modules, setModules] = useState<MarketplaceModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const data = await marketplaceApi.getModules();
        setModules(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const connectModule = async (moduleKey: string) => {
    await marketplaceApi.connectModule(moduleKey);
  };

  return {
    modules,
    isLoading,
    hasModule,
    connectModule
  };
};