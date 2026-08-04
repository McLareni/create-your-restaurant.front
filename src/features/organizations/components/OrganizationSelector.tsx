'use client';

import React from 'react';
import { Lock, Plus, Check, GripVertical } from 'lucide-react';
import { useOrganizationSelector } from '@/features/organizations/hooks/useOrganizationSelector';

export const OrganizationSelector = () => {
  const {
    t,
    router,
    restaurants,
    activeRestaurant,
    maxAllowed,
    isLimitReached,
    handleSelect,
    handleDragStart,
    handleDrop,
  } = useOrganizationSelector();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
        {restaurants.map((res, index) => {
          const isLocked = index >= maxAllowed;
          const isActive = String(activeRestaurant?.id) === String(res.id);

          return (
            <div
              key={res.id}
              draggable={true}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`flex items-center justify-between p-2 rounded-xl border border-solid transition-all duration-150 cursor-grab active:cursor-grabbing ${
                isActive && !isLocked
                  ? 'bg-brand-emerald/5 border-brand-emerald/20 text-brand-emerald shadow-3xs'
                  : isLocked
                    ? 'bg-bg-main/20 text-text-muted/40 border-transparent opacity-40 hover:opacity-100'
                    : 'text-text-muted hover:bg-bg-hover hover:text-text-main border-transparent'
              }`}
            >
              <div className="p-1 text-text-muted/40 shrink-0 transition-colors hover:text-text-muted">
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
          type="button"
          onClick={() => router.push('/dashboard/create-organization')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-dashed border-border-main hover:border-text-muted rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer bg-transparent outline-none"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('sidebar.orgSelector.addNew')}
        </button>
      )}
    </div>
  );
};