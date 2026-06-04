import { MenuItem } from '@/shared/hooks/useNavigation';
import { RestaurantSummary, User } from '@/shared/store/useUserStore';

export interface SidebarState {
  t: (key: string) => string;
  pathname: string;
  user: User | null;
  logout: () => Promise<void>;
  activeRestaurant: RestaurantSummary | null;
  restaurants: RestaurantSummary[];
  menuGroups: MenuItem[][];
  isOrgDropdownOpen: boolean;
  setIsOrgDropdownOpen: (value: boolean) => void;
  expandedMenus: Record<string, boolean>;
  isLockModalOpen: boolean;
  setIsLockModalOpen: (value: boolean) => void;
  lockedModule: { name: string; key: string } | null;
  restaurantToDelete: RestaurantSummary | null;
  setRestaurantToDelete: (value: RestaurantSummary | null) => void;
  isDeleting: boolean;
  orgInitial: string;
  currentOrgName: string;
  handleRestaurantSwitch: (res: RestaurantSummary) => void;
  handleDeleteRestaurantClick: (e: React.MouseEvent, res: RestaurantSummary) => void;
  handleConfirmDeleteRestaurant: () => Promise<void>;
  handleLockedClick: (e: React.MouseEvent, moduleName: string, moduleKey: string) => void;
  handleActivateLocked: () => void;
  toggleSubMenu: (id: string) => void;
  isPurchased: (moduleKey: string) => boolean;
  hasModule: (moduleKey: string) => boolean;
}