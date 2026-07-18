import { Utensils, QrCode, Users, BarChart3, BellRing, ArrowRightLeft, MessageSquareQuote, Palette, Layers } from 'lucide-react';
import type { MarketplaceModule } from '@/features/marketplace/types/marketplace.types';

export const MODULE_CATALOG: MarketplaceModule[] = [
  { key: 'menu-engine', icon: Utensils, price: 0 },
  { key: 'qr-tables', icon: QrCode, price: 0 },
  { key: 'staff', icon: Users, price: 0 },
  { key: 'analytics', icon: BarChart3, price: 59 },
  { key: 'live-calls', icon: BellRing, price: 29 },
  { key: 'pos-sync', icon: ArrowRightLeft, price: 39 },
  { key: 'feedback', icon: MessageSquareQuote, price: 19 },
  { key: 'visual', icon: Palette, price: 25 },
  { key: 'multi-restaurant', icon: Layers, price: 49 },
];