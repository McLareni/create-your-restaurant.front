'use client';

import { useCombosTab } from '../../hooks/combos/useCombosTab';
import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { PackagePlus, Plus } from 'lucide-react';
import { Combo } from '../../types/combos.types';
import { ComboCard } from './comboCard';
import { ComboModal } from './comboModal';

export const CombosTab = () => {
  const state = useCombosTab();

  if (state.isLoading && state.combos.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full">
        <div className="h-16 w-full rounded-xl bg-brand-gray/10 animate-pulse"></div>
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-4">
          <div className="h-44 rounded-xl bg-brand-gray/5 animate-pulse"></div>
          <div className="h-44 rounded-xl bg-brand-gray/5 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">
          {state.t('menu.constructor.combos.title')}
        </h2>
        <Button 
          variant="brand" 
          icon={<Plus className="h-4 w-4" />} 
          onClick={state.openCreateModal} 
          disabled={state.isLoading}
          className="h-10 text-xs font-bold"
        >
          {state.t('menu.constructor.combos.addBtn')}
        </Button>
      </div>

      {state.combos.length === 0 ? (
        <EmptyState 
          icon={<PackagePlus />} 
          title={state.t('menu.constructor.combos.emptyTitle')} 
          description={state.t('menu.constructor.combos.emptyDesc')} 
          actionLabel={state.t('menu.constructor.combos.addBtn')} 
          onAction={state.openCreateModal} 
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
          <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {state.combos.map((combo: Combo) => (
              <div key={combo.id} className="group relative">
                <ComboCard 
                  combo={combo} 
                  onEdit={() => state.openEditModal(combo)} 
                  onDelete={(id) => state.setDeleteId(id)} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {state.isModalOpen && (
        <ComboModal 
          isOpen={state.isModalOpen}
          onClose={() => state.setIsModalOpen(false)}
          isLoading={state.isLoading}
          onSave={state.handleSave}
          initialData={state.formData}
        />
      )}

      <ConfirmModal 
        isOpen={!!state.deleteId} 
        onClose={() => state.setDeleteId(null)} 
        onConfirm={state.handleDeleteConfirm} 
        description={state.t('menu.constructor.combos.deleteConfirm')} 
      />
    </div>
  );
};