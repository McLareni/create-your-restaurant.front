import { 
  LayoutDashboard, 
  Utensils, 
  QrCode, 
  Users, 
  BarChart3, 
  BellRing, 
  ArrowRightLeft, 
  MessageSquareQuote, 
  ShoppingBag, 
  CreditCard,
  Package,
  Paintbrush
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PERMISSIONS, type PermissionKey } from '@/shared/api/menu.constants';

export interface AppRouteConfig {
  id: string;             
  moduleKey?: string;      // Ключ модуля (наприклад, 'menu-engine') для маркетплейсу
  permissionKey?: PermissionKey; // Ключ доступу (наприклад, 'menu:read') для RBAC
  basePath: string;       
  extraPaths?: string[];   
  icon: LucideIcon;       
  sidebarGroup?: 'main' | 'catalog' | 'operations' | 'analytics' | 'system';
  titleKey: string;       
  ownerOnly?: boolean;    
}

export const APP_ROUTES_CONFIG: AppRouteConfig[] = [
  { 
    id: 'home', 
    basePath: '/dashboard', 
    icon: LayoutDashboard, 
    sidebarGroup: 'main', 
    titleKey: 'sidebar.items.home' 
  },
  { 
    id: 'menu', 
    moduleKey: 'menu-engine',
    permissionKey: PERMISSIONS.MENU_READ, 
    basePath: '/dashboard/menu-builder', 
    icon: Utensils, 
    sidebarGroup: 'catalog', 
    titleKey: 'marketplace.modules.menu-engine.title' 
  },
  { 
    id: 'inventory', 
    moduleKey: 'inventory',
    permissionKey: PERMISSIONS.INVENTORY_READ, 
    basePath: '/dashboard/menu-inventory', 
    icon: Package, 
    sidebarGroup: 'catalog', 
    titleKey: 'marketplace.modules.inventory.title' 
  },
  { 
    id: 'qr', 
    moduleKey: 'qr-tables',
    permissionKey: PERMISSIONS.TABLES_READ, 
    basePath: '/dashboard/qr', 
    icon: QrCode, 
    sidebarGroup: 'operations', 
    titleKey: 'marketplace.modules.qr-tables.title' 
  },
  { 
    id: 'staff', 
    moduleKey: 'staff',
    permissionKey: PERMISSIONS.STAFF_READ, 
    basePath: '/dashboard/staff', 
    icon: Users, 
    sidebarGroup: 'operations', 
    titleKey: 'marketplace.modules.staff.title' 
  },
  { 
    id: 'pos', 
    moduleKey: 'pos-sync',
    permissionKey: PERMISSIONS.POS_READ, 
    basePath: '/dashboard/pos', 
    icon: ArrowRightLeft, 
    sidebarGroup: 'operations', 
    titleKey: 'marketplace.modules.pos-sync.title' 
  },
  { 
    id: 'live-calls', 
    moduleKey: 'live-calls',
    permissionKey: PERMISSIONS.LIVE_READ, 
    basePath: '/dashboard/live-calls', 
    icon: BellRing, 
    sidebarGroup: 'operations', 
    titleKey: 'marketplace.modules.live-calls.title' 
  },
  { 
    id: 'analytics', 
    moduleKey: 'analytics',
    permissionKey: PERMISSIONS.ANALYTICS_READ, 
    basePath: '/dashboard/analytics', 
    icon: BarChart3, 
    sidebarGroup: 'analytics', 
    titleKey: 'marketplace.modules.analytics.title' 
  },
  { 
    id: 'feedback', 
    moduleKey: 'feedback', 
    basePath: '/dashboard/feedback', 
    icon: MessageSquareQuote, 
    sidebarGroup: 'analytics', 
    titleKey: 'marketplace.modules.feedback.title' 
  },
  { 
    id: 'marketplace', 
    basePath: '/dashboard/marketplace', 
    icon: ShoppingBag, 
    sidebarGroup: 'system', 
    titleKey: 'sidebar.items.marketplace', 
    ownerOnly: true 
  },
  { 
    id: 'billing', 
    basePath: '/dashboard/billing', 
    icon: CreditCard, 
    sidebarGroup: 'system', 
    titleKey: 'sidebar.items.billing', 
    ownerOnly: true 
  },
  { 
    id: 'visual', 
    moduleKey: 'visual',
    permissionKey: PERMISSIONS.VISUAL_MANAGE,
    basePath: '/dashboard/visual', 
    icon: Paintbrush,
    sidebarGroup: 'system', 
    titleKey: 'marketplace.modules.visual.title',
    ownerOnly: true 
  },
];