import { UtensilsCrossed, QrCode, Users, BellRing, BarChart3, ArrowRightLeft, MessageSquareQuote, Palette } from 'lucide-react';
import { MarketplaceModule } from '../types/marketplace.types';

export const mockAvailableModules: MarketplaceModule[] = [
  { key: 'menu-engine', icon: UtensilsCrossed, price: 0 },
  { key: 'qr-tables', icon: QrCode, price: 0 },
  { key: 'staff', icon: Users, price: 0 },
  { key: 'live-calls', icon: BellRing, price: 499 },
  { key: 'analytics', icon: BarChart3, price: 899 },
  { key: 'pos-sync', icon: ArrowRightLeft, price: 1200 },
  { key: 'feedback', icon: MessageSquareQuote, price: 299 },
  { key: 'visual', icon: Palette, price: 599 },
];

export const marketplaceApi = {
  getModules: async (): Promise<MarketplaceModule[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockAvailableModules), 300));
  },
  connectModule: async (moduleKey: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }
};