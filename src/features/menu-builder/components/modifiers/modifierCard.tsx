'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pencil, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
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
    <div className="flex flex-col rounded-2xl bg-bg-surface border border-border-main/60 dark:border-border-main shadow-table transition-all select-none overflow-hidden">
      <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-bg-hover/30 transition-colors">
        <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={onToggle}>
          <div className="p-1 rounded-md text-text-muted">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              {group.name}
              {group.isRequired && (
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-600 border border-red-500/20 shadow-3xs">
                  {t('menu.constructor.modifiers.requiredBadge')}
                </span>
              )}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 font-light">
              {t('menu.constructor.modifiers.minSelect')} {group.minSelections} |{' '}
              {t('menu.constructor.modifiers.maxSelect')} {group.maxSelections || t('menu.constructor.modifiers.unlimited')} • {group.options.length} {t('menu.constructor.modifiers.optionsCount')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOptionModal();
            }}
            className="h-8 text-xs font-bold border border-brand-emerald/30 text-brand-emerald hover:bg-brand-emerald/5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer bg-transparent outline-none"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{t('menu.constructor.modifiers.addOptionBtn')}</span>
          </button>
          
          <div className="flex items-center gap-1 border-l border-border-main/60 pl-1.5 h-6">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditGroup();
              }} 
              className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup();
              }} 
              className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden min-h-0 border-t border-border-main/60">
          <div className="p-3 sm:p-4 flex flex-col gap-3 bg-bg-main/20">
            {group.options.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted font-light">{t('menu.constructor.modifiers.emptyOptions')}</div>
            ) : (
              <div className="rounded-xl border border-solid border-border-main/60 bg-bg-main/30 overflow-hidden">
                <div className="flex flex-col gap-2 p-2 pr-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {group.options.map((option: ModifierOption) => (
                    <div key={option.id} className={`flex items-center justify-between p-2.5 rounded-xl border border-solid border-border-main dark:border-neutral-800/80 bg-bg-surface hover:border-brand-emerald hover:bg-bg-surface/50 transition-all duration-200 shadow-3xs ${!option.isAvailable ? 'opacity-55' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full shadow-2xs ${option.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                        <span className={`text-xs font-semibold ${!option.isAvailable ? 'text-text-muted line-through' : 'text-text-main'}`}>
                          {option.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-6">
                        <span className="text-xs font-bold text-brand-emerald font-mono">
                          {option.price > 0 ? `+ ${option.price} ${t('menu.currency')}` : t('menu.constructor.modifiers.free')}
                        </span>
                        <div className="flex items-center gap-0.5 bg-bg-element/40 px-1 py-0.5 rounded-lg border border-border-main/20">
                          <button type="button" onClick={() => onEditOption(option)} className="p-1.5 rounded-md text-text-muted hover:text-brand-emerald hover:bg-bg-surface transition-colors border-0 bg-transparent outline-none cursor-pointer">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => onDeleteOption(option.id)} className="p-1.5 rounded-md text-text-muted hover:text-red-500 hover:bg-bg-surface transition-colors border-0 bg-transparent outline-none cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="button"
              onClick={onOpenOptionModal}
              className="w-fit h-8 text-xs border border-dashed border-border-main text-text-muted hover:border-brand-emerald hover:text-brand-emerald bg-bg-surface transition-colors px-3 rounded-lg font-bold flex items-center gap-1 cursor-pointer outline-none"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{t('menu.constructor.modifiers.addOptionBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};