import { useUserStore } from '@/shared/store/useUserStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { PERMISSIONS } from '@/shared/api/menu.constants';

export const usePermissions = () => {
  const user = useUserStore((state) => state.user);
  const permissions = useAccessStore((state) => state.permissions);

  const isOwner = user?.role === 'OWNER';

  const hasPermission = (permission: string) => {
    if (isOwner) return true;
    return permissions.includes(permission);
  };

  return {
    canCreateMenu: hasPermission(PERMISSIONS.MENU_CREATE),
    canEditMenu: hasPermission(PERMISSIONS.MENU_UPDATE),
    canDeleteMenu: hasPermission(PERMISSIONS.MENU_DELETE),
    canReadMenu: hasPermission(PERMISSIONS.MENU_READ),
    canManageInventory: hasPermission(PERMISSIONS.INVENTORY_MANAGE),
    canReadLiveCalls: hasPermission(PERMISSIONS.LIVE_READ),
    canResolveLiveCalls: hasPermission(PERMISSIONS.LIVE_RESOLVE),
    isOwner,
    hasPermission,
  };
};