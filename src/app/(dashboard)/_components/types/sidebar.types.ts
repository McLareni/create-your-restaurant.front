import { MenuItem } from '@/shared/hooks/useNavigation';

export type UserRole = 'OWNER' | 'STAFF' | 'CUSTOMER';

export interface SubMenuItem {
  id: string;
  href: string;
  label: string;
}

export interface SidebarRestaurant {
  id: string | number;
  name: string;
  slug?: string;
  imageUrl?: string | null;
  title?: string;
}

export interface SidebarUserProfile {
  email: string;
  role: string;
  photo?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  restaurants?: SidebarRestaurant[];
}

export interface SidebarState {
  t: (key: string) => string;
  pathname: string;
  user: SidebarUserProfile | null;
  logout: () => Promise<void>;
  activeRestaurant: SidebarRestaurant | null;
  restaurants: SidebarRestaurant[];
  menuGroups: MenuItem[][];
  isOrgDropdownOpen: boolean;
  setIsOrgDropdownOpen: (value: boolean) => void;
  expandedMenus: Record<string, boolean>;
  isLockModalOpen: boolean;
  setIsLockModalOpen: (value: boolean) => void;
  lockedModule: { name: string; key: string } | null;
  restaurantToDelete: SidebarRestaurant | null;
  setRestaurantToDelete: (value: SidebarRestaurant | null) => void;
  isDeleting: boolean;
  orgInitial: string;
  currentOrgName: string;
  handleRestaurantSwitch: (res: SidebarRestaurant) => void;
  handleDeleteRestaurantClick: (e: React.MouseEvent, res: SidebarRestaurant) => void;
  handleConfirmDeleteRestaurant: () => Promise<void>;
  handleLockedClick: (e: React.MouseEvent, moduleName: string, moduleKey: string) => void;
  handleActivateLocked: () => void;
  toggleSubMenu: (id: string) => void;
  isPurchased: (moduleKey: string) => boolean;
  hasModule: (moduleKey: string) => boolean;
}

export interface RestaurantStoreState {
  activeRestaurant: SidebarRestaurant | null;
  setActiveRestaurant: (restaurant: SidebarRestaurant | null) => void;
  clearActiveRestaurant?: () => void;
}