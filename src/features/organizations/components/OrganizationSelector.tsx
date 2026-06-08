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

export const OrganizationSelector = () => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const user = useUserStore((state) => state.user);
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
    restaurant: { id: number; name: string; slug?: string },
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
      setUser({ ...user, restaurants: reordered });
    }
    setDraggedIndex(null);

    try {
      const idsOrder = reordered.map((r) => r.id);
      await apiClient.patch('/restaurants/reorder', { ids: idsOrder });
      
      const currentActiveStillAllowed = reordered
        .slice(0, maxAllowed)
        .some((r) => r.id === activeRestaurant?.id);

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
    <div className="w-full space-y-2 p-2 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <div className="px-2 flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <span>{t('sidebar.orgSelector.switch')}</span>
        <span className="text-[10px] text-neutral-500 font-mono normal-case">
          {restaurants.length} / {maxAllowed}
        </span>
      </div>
      
      <div className="space-y-1">
        {restaurants.map((res, index) => {
          const isLocked = index >= maxAllowed;
          const isActive = activeRestaurant?.id === res.id;

          return (
            <div
              key={res.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-all duration-200 group border ${
                isActive 
                  ? 'bg-neutral-800 text-white font-medium border-neutral-700' 
                  : isLocked
                    ? 'bg-neutral-950/40 text-neutral-600 border-transparent opacity-50'
                    : 'text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200 border-transparent'
              }`}
            >
              <div className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 p-0.5 shrink-0 transition-colors">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              <div
                onClick={() => handleSelect(res, isLocked)}
                className="flex-1 flex items-center justify-between min-w-0 cursor-pointer"
              >
                <span className="truncate pr-2">{res.name}</span>
                
                {isActive && !isLocked && (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                
                {isLocked && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500 font-normal shrink-0">
                    <Lock className="w-3 h-3 text-neutral-600" />
                    <span className="text-[9px] bg-neutral-800 px-1 py-0.5 rounded text-neutral-400 font-mono">
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium border border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('sidebar.orgSelector.addNew')}
        </button>
      )}
    </div>
  );
};