'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/shared/ui';
import { ChevronDown } from 'lucide-react';
import type { UseDishModalReturn } from '@/features/menu-builder/types/dishes.types';
import type { ModifierGroup } from '@/features/menu-builder/types/modifiers.types';

interface DishModifiersTabProps {
  state: UseDishModalReturn;
  t: (key: string) => string;
}

export const DishModifiersTab = ({ state, t }: DishModifiersTabProps) => {
  const modifierGroups = state.modifierGroups as ModifierGroup[] | undefined;
  const [expandedGroupIds, setExpandedGroupIds] = useState<Record<string, boolean>>({});

  const toggleGroupExpand = (id: string) => {
    setExpandedGroupIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      <div className="flex flex-col gap-2.5 max-h-100 overflow-y-auto pr-1 custom-scrollbar">
        {!modifierGroups || modifierGroups.length === 0 ? (
          <span className="text-xs text-text-muted italic text-center py-8 font-light">
            {t('menu.constructor.modifiers.emptyTitle')}
          </span>
        ) : (
          modifierGroups.map((group) => {
            const isChecked = state.dishForm.modifierIds?.includes(group.id) || false;
            const isExpanded = !!expandedGroupIds[group.id];
            const optionsList = group.options || [];

            return (
              <div
                key={group.id}
                className={`rounded-xl border border-solid transition-all bg-bg-surface/60 ${
                  isChecked 
                    ? 'border-brand-emerald/30 shadow-3xs bg-brand-emerald/5' 
                    : 'border-border-main/50'
                }`}
              >
                <div className="flex items-center justify-between p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Checkbox
                      id={`dish-modifier-grp-${group.id}`}
                      checked={isChecked}
                      onChange={() => {
                        const current = state.dishForm.modifierIds || [];
                        const next = isChecked
                          ? current.filter((id) => id !== group.id)
                          : [...current, group.id];
                        state.setDishForm((prev) => ({ ...prev, modifierIds: next }));
                      }}
                    />
                    <label
                      htmlFor={`dish-modifier-grp-${group.id}`}
                      className="text-xs font-bold text-text-main truncate cursor-pointer select-none"
                    >
                      {group.name}
                    </label>
                    {group.isRequired && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-red-500/5 text-red-500/90 border border-red-500/10 shrink-0">
                        {t('menu.constructor.modifiers.requiredBadge')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleGroupExpand(group.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-hover transition-all cursor-pointer border-0 bg-transparent outline-none shrink-0"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-brand-emerald' : ''
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`grid transition-all duration-200 ease-in-out overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] border-t border-solid border-border-main/30' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden min-h-0 bg-bg-main/10">
                    <div className="p-3">
                      {optionsList.length === 0 ? (
                        <span className="text-[11px] text-text-muted italic py-1 block font-light">
                          {t('menu.constructor.modifiers.noOptions')}
                        </span>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {optionsList.map((option) => (
                            <div
                              key={option.id}
                              className={`flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-md bg-bg-surface border border-solid transition-colors ${
                                option.isAvailable === false ? 'opacity-40' : ''
                              } border-border-main/40 hover:border-border-main/80 shadow-3xs`}
                            >
                              <span className="font-semibold text-text-main/90 truncate mr-2">
                                {option.name}
                              </span>
                              <span className="font-extrabold text-brand-emerald shrink-0 bg-brand-emerald/5 px-1.5 py-0.5 rounded-md text-[10px] font-mono">
                                {Number(option.price) > 0 ? `+${option.price} ₴` : '0 ₴'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};