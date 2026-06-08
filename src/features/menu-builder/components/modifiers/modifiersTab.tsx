'use client';

import React from 'react';
import { useModifiersManagement } from '@/features/menu-builder/hooks/modifiers/useModifiersManagement';
import { Button, ConfirmModal } from '@/shared/ui';
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
        <div className="h-16 w-full rounded-xl bg-brand-gray/10" />
        <div className="h-48 w-full rounded-xl bg-brand-gray/5 mt-4" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col pb-10 select-none">
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-brand-cream/80 dark:bg-brand-espresso/80 backdrop-blur-md py-3 border-b border-brand-gray/10 -mx-2 px-2 sm:-mx-6 sm:px-6">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-xl font-bold text-brand-espresso dark:text-brand-cream tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-copper" />
            {state.t('menu.constructor.modifiers.title')}
          </h2>
          <p className="text-sm text-brand-gray mt-1">{state.t('menu.constructor.modifiers.emptyDesc')}</p>
        </div>
        <Button variant="brand" onClick={() => state.handleOpenGroupModal()} disabled={state.isSubmitting} className="h-10 px-5 rounded-lg text-sm shadow-md" icon={<Plus className="h-4 w-4" />}>
          {state.t('menu.constructor.modifiers.addBtn')}
        </Button>
      </div>

      {state.groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 mt-4 rounded-3xl border-2 border-dashed border-brand-gray/20 bg-white/50 dark:bg-brand-mocha/20 text-center">
          <div className="h-16 w-16 bg-brand-cream dark:bg-brand-gray/10 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-brand-copper" />
          </div>
          <h3 className="text-xl font-bold text-brand-espresso dark:text-brand-cream mb-2">{state.t('menu.constructor.modifiers.emptyTitle')}</h3>
          <p className="text-brand-gray max-w-sm mb-6 text-sm">{state.t('menu.constructor.modifiers.emptyStateDesc')}</p>
          <Button variant="outline" onClick={() => state.handleOpenGroupModal()} disabled={state.isSubmitting} className="border-brand-copper text-brand-copper" icon={<Plus className="h-4 w-4" />}>
            {state.t('menu.constructor.modifiers.addFirstBtn')}
          </Button>
        </div>
      ) : (
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
      )}

      <ModifierGroupModal isOpen={state.isGroupModalOpen} onClose={() => state.setIsGroupModalOpen(false)} isEditing={!!state.editingGroup} form={state.groupForm} setForm={state.setGroupForm} onSave={state.handleSaveGroup} errors={state.groupErrors} />
      <ModifierOptionModal isOpen={state.isOptionModalOpen} onClose={() => state.setIsOptionModalOpen(false)} isEditing={!!state.editingOption} form={state.optionForm} setForm={state.setFormData} onSave={state.handleSaveOption} />
      <ConfirmModal isOpen={!!state.deleteTarget} onClose={() => state.setDeleteTarget(null)} onConfirm={state.handleConfirmDelete} description={state.deleteTarget?.type === 'group' ? state.t('menu.constructor.modifiers.deleteConfirm') : state.t('menu.constructor.modifiers.deleteOptionConfirm')} />
    </div>
  );
};