import { LucideIcon } from 'lucide-react';

export interface MarketplaceModule {
  key: string;
  icon: LucideIcon;
  price: number;
}

export interface ConnectModulePayload {
  moduleKey: string;
  activationCode?: string;
}

export interface AccessResponse {
  purchasedModules: string[];
  activeModules: string[];
  permissions: string[];
}