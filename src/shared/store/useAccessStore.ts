import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';

interface AccessResponse {
  purchasedModules: string[];
  activeModules: string[];
  permissions: string[];
}

interface AccessState {
  purchasedModules: string[];
  activeModules: string[];
  permissions: string[];
  isLoadingAccess: boolean;
  
  fetchAccessData: (restaurantId: string) => Promise<void>;
  hasModule: (moduleKey: string) => boolean;
  isPurchased: (moduleKey: string) => boolean;
  hasPermission: (permissionKey: string) => boolean;
  
  toggleModule: (moduleKey: string, isActive: boolean) => void;
  purchaseModule: (moduleKey: string) => void;
}

export const useAccessStore = create<AccessState>((set, get) => ({
  purchasedModules: [],
  activeModules: [],
  permissions: [],
  isLoadingAccess: false,

  fetchAccessData: async (restaurantId: string) => {
    set({ isLoadingAccess: true });
    try {
      const response = await apiClient.get<AccessResponse>(`/restaurants/${restaurantId}/access`);
      set({ 
        purchasedModules: response.purchasedModules || [],
        activeModules: response.activeModules || [],
        permissions: response.permissions || [],
        isLoadingAccess: false 
      });
    } catch (error) {
      set({ 
        purchasedModules: [],
        activeModules: [],
        permissions: [],
        isLoadingAccess: false 
      });
      throw error;
    }
  },

  hasModule: (moduleKey: string) => get().activeModules.includes(moduleKey),
  
  isPurchased: (moduleKey: string) => get().purchasedModules.includes(moduleKey),

  hasPermission: (permissionKey: string) => get().permissions.includes(permissionKey),

  toggleModule: (moduleKey: string, isActive: boolean) => {
    set((state) => ({
      activeModules: isActive 
        ? [...state.activeModules, moduleKey] 
        : state.activeModules.filter(key => key !== moduleKey)
    }));
  },

  purchaseModule: (moduleKey: string) => {
    set((state) => ({
      purchasedModules: [...state.purchasedModules, moduleKey],
      activeModules: [...state.activeModules, moduleKey]
    }));
  }
}));