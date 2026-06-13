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

export interface ConnectModuleArgs {
  moduleKey: string;
  activationCode?: string;
}

export interface ModuleCardProps {
  moduleData: MarketplaceModule;
  isPurchased: boolean;
  isActive: boolean;
  onConnect: (moduleKey: string) => void;
  onToggle: (moduleKey: string, isActive: boolean) => void;
  onSettingsClick: (moduleKey: string) => void;
  isDisabled?: boolean;
}