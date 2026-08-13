'use client';

import React from 'react';
import { useModifiersManagement } from '@/features/menu-builder/hooks/modifiers/useModifiersManagement';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { ModifierGroupModal } from '@/features/menu-builder/components/modifiers/modifierGroupModal';
import { ModifierOptionModal } from '@/features/menu-builder/components/modifiers/modifierOptionModal';
import { ConfirmModal } from '@/shared/ui';
import { PageLoader } from '@/shared/ui/pageLoader';
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, SlidersHorizontal, Settings2 } from 'lucide-react';

export const ModifiersTab = () => {
  const state = useModifiersManagement();
  const { canCreateMenu, canEditMenu, canDeleteMenu } = usePermissions();

  if (state.isLoading && state.groups.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="w-full h-full p-4 select-none flex flex-col text-text-main bg-bg-main">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-solid border-border-main/60 pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-brand-emerald" />
            {state.t('menu.constructor.modifiers.title')}
          </h2>
          <p className="text-sm text-text-muted font-light mt-1">
            {state.t('menu.constructor.modifiers.subtitle')}
          </p>
        </div>
        {canCreateMenu && (
          <button
            type="button"
            onClick={() => state.handleOpenGroupModal()}
            className="h-11 px-5 rounded-full bg-brand-emerald hover:bg-brand-emerald-hover text-white text-sm font-bold shadow-md transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            {state.t('menu.constructor.modifiers.addBtn')}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {state.groups.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-bg-surface p-8">
            <Settings2 className="h-10 w-10 text-text-muted/30 mx-auto mb-3" />
            <p className="text-sm text-text-muted font-medium">
              {state.t('menu.constructor.modifiers.emptyTitle')}
            </p>
          </div>
        ) : (
          state.groups.map((group) => {
            const isExpanded = !!state.expandedGroups[group.id];
            return (
              <div
                key={group.id}
                className="bg-bg-surface border border-solid border-neutral-300 dark:border-neutral-700 rounded-xl shadow-table overflow-hidden transition-all"
              >
                <div className="flex items-center justify-between p-4 gap-4 bg-bg-main/20">
                  <div
                    onClick={() => state.toggleGroup(group.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="text-text-muted/60 shrink-0">
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text-main truncate">{group.name}</h3>
                        {group.isRequired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-500 rounded-md shrink-0">
                            {state.t('menu.constructor.modifiers.requiredBadge')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 font-medium">
                        {state.t('menu.constructor.modifiers.minSelect')} {group.minSelections} |{' '}
                        {state.t('menu.constructor.modifiers.maxSelect')} {group.maxSelections || state.t('menu.constructor.modifiers.unlimited')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {canCreateMenu && (
                      <button
                        type="button"
                        onClick={() => state.handleOpenOptionModal(group.id)}
                        className="p-2 text-brand-emerald hover:bg-brand-emerald/10 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                        title={state.t('menu.constructor.modifiers.addOptionBtn')}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                    {canEditMenu && (
                      <button
                        type="button"
                        onClick={() => state.handleOpenGroupModal(group)}
                        className="p-2 text-text-muted hover:text-brand-emerald hover:bg-bg-element rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    {canDeleteMenu && (
                      <button
                        type="button"
                        onClick={() => state.setDeleteTarget({ type: 'group', id: group.id })}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-solid border-neutral-200 dark:border-neutral-800 p-3 bg-bg-surface space-y-1 animate-in fade-in duration-150">
                    {group.options.length === 0 ? (
                      <p className="text-xs text-text-muted italic p-3 text-center font-light">
                        {state.t('menu.constructor.modifiers.noOptions')}
                      </p>
                    ) : (
                      group.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-solid border-neutral-100 dark:border-neutral-900/40 bg-bg-main/10 hover:bg-bg-main/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`text-xs font-semibold ${option.isAvailable ? 'text-text-main' : 'text-text-muted line-through'}`}>
                              {option.name}
                            </span>
                            {!option.isAvailable && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-neutral-500/10 text-text-muted rounded">
                                {state.t('menu.constructor.modifiers.disabledBadge')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs font-bold font-mono text-text-muted">
                              {option.price > 0 ? `+ ${option.price} ${state.t('menu.currency')}` : state.t('menu.constructor.modifiers.free')}
                            </span>
                            <div className="flex items-center gap-1">
                              {canEditMenu && (
                                <button
                                  type="button"
                                  onClick={() => state.handleOpenOptionModal(group.id, option)}
                                  className="p-1 text-text-muted hover:text-brand-emerald hover:bg-bg-element rounded transition-colors cursor-pointer border-0 bg-transparent"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {canDeleteMenu && (
                                <button
                                  type="button"
                                  onClick={() => state.setDeleteTarget({ type: 'option', id: option.id, groupId: group.id })}
                                  className="p-1 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ModifierGroupModal
        key={state.editingGroup?.id} 
        isOpen={state.isGroupModalOpen}
        onClose={() => state.setIsGroupModalOpen(false)}
        isEditing={!!state.editingGroup}
        editingGroup={state.editingGroup}
        groupFormAction={state.groupFormAction}
        errors={state.groupErrors}
        isLoading={state.isSubmitting}
      />

      <ModifierOptionModal
        isOpen={state.isOptionModalOpen}
        onClose={() => state.setIsOptionModalOpen(false)}
        isEditing={!!state.editingOption}
        form={state.optionForm}
        setForm={state.setOptionForm}
        onSave={state.handleSaveOption}
        isLoading={state.isSubmitting}
      />

      <ConfirmModal
        isOpen={!!state.deleteTarget}
        onClose={() => state.setDeleteTarget(null)}
        onConfirm={state.handleConfirmDelete}
        title={state.deleteTarget?.type === 'group' ? state.t('menu.constructor.modifiers.deleteGroupTitle') : state.t('menu.constructor.modifiers.deleteOptionTitle')}
        description={state.t('menu.constructor.modifiers.deleteConfirm')}
      />
    </div>
  );
};