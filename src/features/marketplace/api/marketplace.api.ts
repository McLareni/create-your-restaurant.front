import { apiClient } from '@/shared/api/client';
import { MODULE_CATALOG } from '@/features/marketplace/constants/marketplace.constants';
import { Utensils } from 'lucide-react';
import type { MarketplaceModule } from '@/features/marketplace/types/marketplace.types';

export const marketplaceApi = {
  getModules: (purchased: string[], active: string[]): MarketplaceModule[] => {
    const knownFromAccess = new Set([...purchased, ...active]);

    const dynamicModules = [...knownFromAccess]
      .filter((key) => !MODULE_CATALOG.some((moduleItem) => moduleItem.key === key))
      .map((key) => ({ key, icon: Utensils, price: 0 }));

    return [...MODULE_CATALOG, ...dynamicModules];
  },

  connectModule: async (restaurantId: number, moduleKey: string, activationCode?: string): Promise<boolean> => {
    await apiClient.post(`/restaurants/${restaurantId}/modules/connect`, { moduleKey, activationCode });
    return true;
  },
};