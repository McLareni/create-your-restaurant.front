'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { PackagePlus, Plus } from 'lucide-react';
import { useCombos } from '../../hooks/useCombos';
import { Combo, CreateComboDTO } from '../../types/combos.types';
import { ComboCard } from './comboCard';
import { ComboModal } from './comboModal';

const INITIAL_FORM_DATA: CreateComboDTO = { name: '', priceType: 'FIXED', priceValue: 0, dishes: [] };

export const CombosTab = () => {
  const { t } = useTranslation();
  const { combos, isLoading, createCombo, updateCombo, deleteCombo } = useCombos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [formData, setFormData] = useState<CreateComboDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCombo(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
  };

  const openEditModal = (combo: Combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      priceType: combo.priceType,
      priceValue: combo.priceValue,
      dishes: combo.dishes,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateComboDTO) => {
    if (editingCombo) {
      await updateCombo({ id: editingCombo.id, data });
    } else {
      await createCombo(data);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteCombo(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('menu.constructor.combos.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal} disabled={isLoading}>
          {t('menu.constructor.combos.addBtn')}
        </Button>
      </div>

      {combos.length === 0 ? (
        <EmptyState 
          icon={<PackagePlus />} 
          title={t('menu.constructor.combos.emptyTitle')} 
          description={t('menu.constructor.combos.emptyDesc')} 
          actionLabel={t('menu.constructor.combos.addBtn')} 
          onAction={openCreateModal} 
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
          <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {combos.map((combo: Combo) => (
              <ComboCard 
                key={combo.id} 
                combo={combo} 
                onEdit={() => openEditModal(combo)} 
                onDelete={(id) => setDeleteId(id)} 
              />
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <ComboModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoading}
          onSave={handleSave}
          initialData={formData}
        />
      )}

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDeleteConfirm} 
        description={t('menu.constructor.combos.deleteConfirm')} 
      />
    </div>
  );
};