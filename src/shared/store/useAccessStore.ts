import { create } from 'zustand';

interface AccessState {
  activeModules: string[];
  permissions: string[];
  isLoadingAccess: boolean;
  fetchAccessData: (restaurantId: string) => Promise<void>;
  hasModule: (moduleKey: string) => boolean;
  hasPermission: (permissionKey: string) => boolean;
}

export const useAccessStore = create<AccessState>((set, get) => ({
  activeModules: [],
  permissions: [],
  isLoadingAccess: false,

  fetchAccessData: async (restaurantId: string) => {
    set({ isLoadingAccess: true });
    try {
      const mockActiveModules = ['live-calls', 'menu-engine', 'qr-tables', 'staff'];
      const mockPermissions = ['menu:read', 'menu:edit', 'staff:view'];

      set({ 
        activeModules: mockActiveModules,
        permissions: mockPermissions,
        isLoadingAccess: false 
      });
    } catch (error) {
      set({ activeModules: [], permissions: [], isLoadingAccess: false });
    }
  },

  hasModule: (moduleKey: string) => {
    return get().activeModules.includes(moduleKey);
  },

  hasPermission: (permissionKey: string) => {
    return get().permissions.includes(permissionKey);
  }
}));