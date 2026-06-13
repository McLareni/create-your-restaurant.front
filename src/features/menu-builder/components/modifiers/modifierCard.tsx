'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pencil, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/shared/ui';
import type { ModifierCardProps, ModifierOption } from '@/features/menu-builder/types/modifiers.types';

export const ModifierCard = ({
  group,
  isExpanded,
  onToggle,
  onEditGroup,
  onDeleteGroup,
  onOpenOptionModal,
  onEditOption,
  onDeleteOption,
}: ModifierCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-brand-mocha border border-brand-gray/10 shadow-xs transition-all">
      <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-brand-cream/30 dark:hover:bg-brand-gray/5 transition-colors rounded-xl">
        <div className="flex items-center gap-2 flex-1 cursor-pointer select-none" onClick={onToggle}>
          <div className="p-1 rounded-md text-brand-gray">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-2">
              {group.name}
              {group.isRequired && (
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-50 text-red-600 border border-red-100">
                  {t('menu.constructor.modifiers.requiredBadge')}
                </span>
              )}
            </h3>
            <p className="text-xs text-brand-gray mt-0.5">
              {t('menu.constructor.modifiers.minSelect')} {group.minSelections} |{' '}
              {t('menu.constructor.modifiers.maxSelect')} {group.maxSelections || t('menu.constructor.modifiers.unlimited')} • {group.options.length} {t('menu.constructor.modifiers.optionsCount')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOptionModal();
            }}
            className="h-8 text-xs border-brand-copper/30 text-brand-copper hover:bg-brand-copper/5 px-3 rounded-lg font-semibold"
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            {t('menu.constructor.modifiers.addOptionBtn')}
          </Button>
          
          <div className="flex items-center gap-1 border-l border-brand-gray/10 pl-1.5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEditGroup();
              }} 
              className="p-2 rounded-lg text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/10 transition-colors cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup();
              }} 
              className="p-2 rounded-lg text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-brand-gray/10' : 'grid-rows-[0fr] opacity-0 h-0 overflow-hidden'}`}>
        <div className="overflow-hidden">
          <div className="p-2 sm:p-4 flex flex-col gap-2">
            {group.options.length === 0 ? (
              <div className="p-4 text-center text-sm text-brand-gray">{t('menu.constructor.modifiers.emptyOptions')}</div>
            ) : (
              group.options.map((option: ModifierOption) => (
                <div key={option.id} className={`flex items-center justify-between p-3 rounded-lg border border-brand-gray/10 bg-brand-cream/10 dark:bg-brand-gray/5 hover:border-brand-copper/30 transition-colors ${!option.isAvailable ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${option.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className={`text-sm font-medium ${!option.isAvailable ? 'text-brand-gray line-through' : 'text-brand-espresso dark:text-brand-cream'}`}>
                      {option.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-sm font-bold text-brand-copper">
                      {option.price > 0 ? `+ ${option.price} ${t('menu.currency')}` : t('menu.constructor.modifiers.free')}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEditOption(option)} className="p-1.5 rounded-md text-brand-gray hover:text-brand-copper hover:bg-white transition-colors cursor-pointer">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDeleteOption(option.id)} className="p-1.5 rounded-md text-brand-gray hover:text-red-500 hover:bg-white transition-colors cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <Button 
              variant="outline" 
              onClick={onOpenOptionModal}
              className="mt-1 h-8 w-fit text-xs border-dashed border-2 border-brand-gray/30 text-brand-gray hover:border-brand-copper hover:text-brand-copper bg-transparent transition-colors px-3 rounded-lg font-medium"
              icon={<Plus className="h-3.5 w-3.5" />}
            >
              {t('menu.constructor.modifiers.addOptionBtn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};