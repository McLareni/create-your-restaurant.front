import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { useRestaurantStore } from './useRestaurantStore';

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

  clearAccessData: () => void;

  fetchAccessData: (restaurantId: string) => Promise<void>;
  hasModule: (moduleKey: string) => boolean;
  isPurchased: (moduleKey: string) => boolean;
  hasPermission: (permissionKey: string) => boolean;
  toggleModule: (moduleKey: string, isActive: boolean) => Promise<void>;
  purchaseModule: (moduleKey: string) => void;
}

export const useAccessStore = create<AccessState>((set, get) => ({
  purchasedModules: [],
  activeModules: [],
  permissions: [],
  isLoadingAccess: false,

  clearAccessData: () =>
    set({
      purchasedModules: [],
      activeModules: [],
      permissions: [],
    }),

  fetchAccessData: async (restaurantId: string) => {
    set({
      isLoadingAccess: true,
      purchasedModules: [],
      activeModules: [],
      permissions: [],
    });

    try {
      const response = await apiClient.get<AccessResponse>(
        `/restaurants/${restaurantId}/access`
      );

      set({
        purchasedModules: response.purchasedModules || [],
        activeModules: response.activeModules || [],
        permissions: response.permissions || [],
        isLoadingAccess: false,
      });
    } catch (error) {
      set({
        purchasedModules: [],
        activeModules: [],
        permissions: [],
        isLoadingAccess: false,
      });
    }
  },

  hasModule: (moduleKey: string) =>
    get().activeModules.includes(moduleKey),

  isPurchased: (moduleKey: string) =>
    get().purchasedModules.includes(moduleKey),

  hasPermission: (permissionKey: string) =>
    get().permissions.includes(permissionKey),

  toggleModule: async (moduleKey: string, isActive: boolean) => {
    const previousModules = get().activeModules;

    const nextModules = isActive
      ? previousModules.includes(moduleKey)
        ? previousModules
        : [...previousModules, moduleKey]
      : previousModules.filter((key) => key !== moduleKey);

    set({
      activeModules: nextModules,
    });

    const restaurantId =
      useRestaurantStore.getState().activeRestaurant?.id;

    if (!restaurantId) {
      return;
    }

    try {
      await apiClient.post(
        `/restaurants/${restaurantId}/modules/toggle`,
        {
          moduleKey,
          isActive,
        }
      );
    } catch (error) {
      set({
        activeModules: previousModules,
      });

      throw error;
    }
  },

  purchaseModule: (moduleKey: string) => {
    set((state) => ({
      purchasedModules: state.purchasedModules.includes(moduleKey)
        ? state.purchasedModules
        : [...state.purchasedModules, moduleKey],

      activeModules: state.activeModules.includes(moduleKey)
        ? state.activeModules
        : [...state.activeModules, moduleKey],
    }));
  },
}));