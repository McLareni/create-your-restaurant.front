'use client';

import React from 'react';
import { useModifiersManagement } from '@/features/menu-builder/hooks/modifiers/useModifiersManagement';
import { ConfirmModal } from '@/shared/ui';
import { Plus, Layers } from 'lucide-react';
import { ModifierGroupModal } from '@/features/menu-builder/components/modifiers/modifierGroupModal';
import { ModifierOptionModal } from '@/features/menu-builder/components/modifiers/modifierOptionModal';
import { ModifierCard } from '@/features/menu-builder/components/modifiers/modifierCard';
import type { ModifierGroup, ModifierOption } from '@/features/menu-builder/types/modifiers.types';

export const ModifiersTab = () => {
  const state = useModifiersManagement();

  if (state.isLoading && state.groups.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
        <div className="h-16 w-full rounded-xl bg-bg-element/50 border border-border-main/40" />
        <div className="h-48 w-full rounded-xl bg-bg-element/30 border border-border-main/20 mt-4" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col select-none text-text-main overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-border-main/60 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-emerald" />
            {state.t('menu.constructor.modifiers.title')}
          </h2>
          <p className="text-xs text-text-muted mt-1 font-light">{state.t('menu.constructor.modifiers.emptyDesc')}</p>
        </div>
        <button 
          type="button"
          onClick={() => state.handleOpenGroupModal()} 
          disabled={state.isSubmitting} 
          className="h-10 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-brand-emerald/10 cursor-pointer select-none transition-all"
        >
          <Plus className="h-4 w-4" />
          {state.t('menu.constructor.modifiers.addBtn')}
        </button>
      </div>

      {state.groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 mt-4 rounded-3xl border border-dashed border-border-main bg-bg-element/20 text-center shadow-3xs animate-in fade-in duration-200">
          <div className="h-16 w-16 bg-brand-emerald/10 rounded-full flex items-center justify-center mb-4 border border-brand-emerald/5">
            <Layers className="h-8 w-8 text-brand-emerald" />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">{state.t('menu.constructor.modifiers.emptyTitle')}</h3>
          <p className="text-text-muted max-w-sm mb-6 text-xs font-light leading-relaxed">{state.t('menu.constructor.modifiers.emptyStateDesc')}</p>
          <button 
            type="button"
            onClick={() => state.handleOpenGroupModal()} 
            disabled={state.isSubmitting} 
            className="h-10 px-5 text-xs font-bold border border-border-main bg-bg-surface text-text-main hover:border-brand-emerald hover:text-brand-emerald rounded-xl shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none select-none"
          >
            <Plus className="h-4 w-4" />
            <span>{state.t('menu.constructor.modifiers.addFirstBtn')}</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="flex flex-col gap-4">
            {state.groups.map((group: ModifierGroup) => (
              <ModifierCard
                key={group.id}
                group={group}
                isExpanded={!!state.expandedGroups[group.id]}
                onToggle={() => state.toggleGroup(group.id)}
                onEditGroup={() => state.handleOpenGroupModal(group)}
                onDeleteGroup={() => state.setDeleteTarget({ type: 'group', id: group.id })}
                onOpenOptionModal={() => state.handleOpenOptionModal(group.id)}
                onEditOption={(option: ModifierOption) => state.handleOpenOptionModal(group.id, option)}
                onDeleteOption={(optionId: string) => state.setDeleteTarget({ type: 'option', id: optionId, groupId: group.id })}
              />
            ))}
          </div>
        </div>
      )}

      <ModifierGroupModal isOpen={state.isGroupModalOpen} onClose={() => state.setIsGroupModalOpen(false)} isEditing={!!state.editingGroup} form={state.groupForm} setForm={state.setGroupForm} onSave={state.handleSaveGroup} errors={state.groupErrors} />
      <ModifierOptionModal isOpen={state.isOptionModalOpen} onClose={() => state.setIsOptionModalOpen(false)} isEditing={!!state.editingOption} form={state.optionForm} setForm={state.setFormData} onSave={state.handleSaveOption} />
      <ConfirmModal isOpen={!!state.deleteTarget} onClose={() => state.setDeleteTarget(null)} onConfirm={state.handleConfirmDelete} description={state.deleteTarget?.type === 'group' ? state.t('menu.constructor.modifiers.deleteConfirm') : state.t('menu.constructor.modifiers.deleteOptionConfirm')} />
    </div>
  );
};