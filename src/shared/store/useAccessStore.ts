import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';

interface AccessResponse {
  activeModules: string[];
  permissions: string[];
}

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
      const response = await apiClient.get<AccessResponse>(`/restaurants/${restaurantId}/access`);

      set({ 
        activeModules: response.activeModules || [],
        permissions: response.permissions || [],
        isLoadingAccess: false 
      });
    } catch (error) {
      set({ 
        activeModules: ['live-calls', 'menu-engine', 'qr-tables', 'staff', 'analytics', 'pos-sync', 'feedback', 'visual'], 
        permissions: ['menu:read', 'menu:edit', 'staff:view'], 
        isLoadingAccess: false 
      });
    }
  },

  hasModule: (moduleKey: string) => {
    return get().activeModules.includes(moduleKey);
  },

  hasPermission: (permissionKey: string) => {
    return get().permissions.includes(permissionKey);
  }
}));