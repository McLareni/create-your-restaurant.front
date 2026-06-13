'use client';

import { useCombosManagement } from '@/features/menu-builder/hooks/combos/useCombosManagement';
import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { PackagePlus, Plus } from 'lucide-react';
import { Combo } from '@/features/menu-builder/types/combos.types';
import { ComboCard } from '@/features/menu-builder/components/combos/comboCard';
import { ComboModal } from '@/features/menu-builder/components/combos/comboModal';

export const CombosTab = () => {
  const state = useCombosManagement();

  if (state.isLoading && state.combos.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
        <div className="h-16 w-full rounded-xl bg-brand-gray/10" />
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-4">
          <div className="h-44 rounded-xl bg-brand-gray/5" />
          <div className="h-44 rounded-xl bg-brand-gray/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col select-none">
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
          <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr)) err]">
            {state.combos.map((combo: Combo) => (
              <div key={combo.id} className="group relative">
                <ComboCard 
                  combo={combo} 
                  allDishes={state.allDishes}
                  onEdit={() => state.openEditModal(combo)} 
                  onDelete={(id) => state.setDeleteId(id)} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ComboModal state={state} />

      <ConfirmModal 
        isOpen={!!state.deleteId} 
        onClose={() => state.setDeleteId(null)} 
        onConfirm={state.handleDeleteConfirm} 
        description={state.t('menu.constructor.combos.deleteConfirm')} 
      />
    </div>
  );
};