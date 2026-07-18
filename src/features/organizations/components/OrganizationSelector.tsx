'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { apiClient } from '@/shared/api/client';
import { Lock, Plus, Check, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { SidebarRestaurant } from '@/app/(dashboard)/_components/types/sidebar.types';
import type { User } from '@/shared/store/useUserStore';

type ExtendedUser = User & {
  restaurants?: SidebarRestaurant[];
};

export const OrganizationSelector = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserStore((state) => state.user) as ExtendedUser | null;
  const setUser = useUserStore((state) => state.setUser);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const setActiveRestaurant = useRestaurantStore((state) => state.setActiveRestaurant);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const restaurants = user?.restaurants || [];
  const hasMultiModule = purchasedModules.includes('multi-restaurant');
  const maxAllowed = hasMultiModule ? 3 : 1;
  const isLimitReached = restaurants.length >= maxAllowed;

  const handleSelect = (
    restaurant: SidebarRestaurant,
    isLocked: boolean
  ) => {
    if (isLocked) {
      toast.error(t('sidebar.locked.title'));
      router.push('/dashboard/marketplace');
      return;
    }
    setActiveRestaurant(restaurant);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...restaurants];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    if (user) {
      const updatedUser: ExtendedUser = { ...user, restaurants: reordered };
      setUser(updatedUser);
    }
    setDraggedIndex(null);
    try {
      const idsOrder = reordered.map((r) => r.id);
      await apiClient.patch('/restaurants/reorder', { ids: idsOrder });
      const currentActiveStillAllowed = reordered
        .slice(0, maxAllowed)
        .some((r) => String(r.id) === String(activeRestaurant?.id));
      if (!currentActiveStillAllowed && reordered.length > 0) {
        setActiveRestaurant(reordered[0]);
      }
      
      toast.success(t('marketplace.status.enabled'));
    } catch {
      toast.error(t('organization.errors.serverError'));
      await useUserStore.getState().fetchUser(true);
    }
  };

  return (
    <div className="w-full space-y-2 p-2 bg-bg-element/50 rounded-xl border border-border-main">
      <div className="px-2 flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
        <span>{t('sidebar.orgSelector.switch')}</span>
        <span className="text-[10px] text-text-muted/70 font-mono normal-case">
          {restaurants.length} / {maxAllowed}
        </span>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {restaurants.map((res: SidebarRestaurant, index: number) => {
          const isLocked = index >= maxAllowed;
          const isActive = String(activeRestaurant?.id) === String(res.id);

          return (
            <div
              key={res.id}
              className={`flex items-center justify-between p-2 rounded-xl border border-solid transition-all duration-150 ${
                isActive && !isLocked
                  ? 'bg-brand-emerald/5 border-brand-emerald/20 text-brand-emerald shadow-3xs'
                  : isLocked
                    ? 'bg-bg-main/20 text-text-muted/40 border-transparent opacity-40 select-none'
                    : 'text-text-muted hover:bg-bg-hover hover:text-text-main border-transparent'
              }`}
            >
              <div
                draggable={!isLocked}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`p-1 text-text-muted/40 shrink-0 transition-colors ${
                  isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:text-text-muted'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              <div
                onClick={() => handleSelect(res, isLocked)}
                className="flex-1 flex items-center justify-between min-w-0 cursor-pointer pl-1"
              >
                <span className="truncate pr-2 font-medium">{res.name}</span>
                
                {isActive && !isLocked && (
                  <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                )}
                
                {isLocked && (
                  <div className="flex items-center gap-1 text-xs text-text-muted font-normal shrink-0">
                    <Lock className="w-3 h-3 text-text-muted/60" />
                    <span className="text-[9px] bg-bg-element px-1 py-0.5 rounded text-text-muted border border-border-main/30 font-mono">
                      HOLD
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLimitReached ? (
        <div className="w-full px-2 py-1.5 text-[11px] text-center text-amber-500/80 bg-amber-500/5 rounded-lg border border-amber-500/10">
          {t('sidebar.limitReached')}
        </div>
      ) : (
        <button
          onClick={() => router.push('/dashboard/restaurants/new')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-dashed border-border-main hover:border-text-muted rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer bg-transparent outline-none"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('sidebar.orgSelector.addNew')}
        </button>
      )}
    </div>
  );
};