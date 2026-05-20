import { apiClient } from '@/shared/api/client';
import { MarketplaceModule } from '../types/marketplace.types';

export const marketplaceApi = {
  getModules: async (restaurantId: number): Promise<MarketplaceModule[]> => {
    return await apiClient.get<MarketplaceModule[]>(`/restaurants/${restaurantId}/modules`);
  },
  connectModule: async (restaurantId: number, moduleKey: string): Promise<boolean> => {
    return await apiClient.post<boolean>(`/restaurants/${restaurantId}/modules/connect`, { moduleKey });
  }
};