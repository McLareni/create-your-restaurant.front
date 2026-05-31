import { MenuItem } from '@/shared/hooks/useNavigation';

export interface SidebarState {
  t: (key: string) => string;
  pathname: string;
  user: any;
  logout: () => Promise<void>;
  activeRestaurant: any;
  restaurants: any[];
  menuGroups: MenuItem[][];
  isOrgDropdownOpen: boolean;
  setIsOrgDropdownOpen: (value: boolean) => void;
  expandedMenus: Record<string, boolean>;
  isLockModalOpen: boolean;
  setIsLockModalOpen: (value: boolean) => void;
  lockedModule: { name: string; key: string } | null;
  restaurantToDelete: any;
  setRestaurantToDelete: (value: any) => void;
  isDeleting: boolean;
  orgInitial: string;
  currentOrgName: string;
  handleRestaurantSwitch: (res: any) => void;
  handleDeleteRestaurantClick: (e: React.MouseEvent, res: any) => void;
  handleConfirmDeleteRestaurant: () => Promise<void>;
  handleLockedClick: (e: React.MouseEvent, moduleName: string, moduleKey: string) => void;
  handleActivateLocked: () => void;
  toggleSubMenu: (id: string) => void;
  isPurchased: (moduleKey: string) => boolean;
  hasModule: (moduleKey: string) => boolean;
}