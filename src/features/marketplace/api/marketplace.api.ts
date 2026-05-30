import { apiClient } from '@/shared/api/client';
import { MarketplaceModule } from '../types/marketplace.types';
import { Utensils, QrCode, Users, BarChart3, BellRing, ArrowRightLeft, MessageSquareQuote, Palette, } from 'lucide-react';

type AccessResponse = {
  purchasedModules: string[];
  activeModules: string[];
  permissions: string[];
};

const MODULE_CATALOG: MarketplaceModule[] = [
  { key: 'menu-engine', icon: Utensils, price: 0 },
  { key: 'qr-tables', icon: QrCode, price: 0 },
  { key: 'staff', icon: Users, price: 0 },
  { key: 'analytics', icon: BarChart3, price: 59 },
  { key: 'live-calls', icon: BellRing, price: 29 },
  { key: 'pos-sync', icon: ArrowRightLeft, price: 39 },
  { key: 'feedback', icon: MessageSquareQuote, price: 19 },
  { key: 'visual', icon: Palette, price: 25 },
];

export const marketplaceApi = {
  getModules: async (restaurantId: number): Promise<MarketplaceModule[]> => {
    const access = await apiClient.get<AccessResponse>(`/restaurants/${restaurantId}/access`);
    const knownFromAccess = new Set([
      ...(access.purchasedModules || []),
      ...(access.activeModules || []),
    ]);
    const dynamicModules = [...knownFromAccess]
      .filter((key) => !MODULE_CATALOG.some((moduleItem) => moduleItem.key === key))
      .map((key) => ({ key, icon: Utensils, price: 0 }));
    return [...MODULE_CATALOG, ...dynamicModules];
  },

  connectModule: async (restaurantId: number, moduleKey: string): Promise<boolean> => {
    await apiClient.post(`/restaurants/${restaurantId}/modules/connect`, { moduleKey });
    return true;
  }
};