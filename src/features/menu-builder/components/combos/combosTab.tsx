'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Modal, ConfirmModal, EmptyState } from '@/shared/ui';
import { PackagePlus, Plus, Search, X } from 'lucide-react';
import { useCombos } from '../../hooks/useCombos';
import { mockAvailableDishes } from '../../api/combos.api';
import { Combo, CreateComboDTO, ComboDish } from '../../types/combos.types';
import { ComboCard } from './comboCard';
import { useCrudModal } from '@/shared/hooks/useCrudModal';

const INITIAL_FORM_DATA: CreateComboDTO = { name: '', priceType: 'FIXED', priceValue: 0, dishes: [] };

export const CombosTab = () => {
  const { t } = useTranslation();
  const { combos, createCombo, updateCombo, deleteCombo } = useCombos();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingCombo,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  } = useCrudModal<Combo, CreateComboDTO>({
    initialFormData: INITIAL_FORM_DATA,
    createItem: createCombo,
    updateItem: updateCombo,
    deleteItem: deleteCombo,
  });

  const onOpenCreate = () => {
    setSearchQuery('');
    openCreateModal();
  };

  const onOpenEdit = (combo: Combo) => {
    setSearchQuery('');
    openEditModal(combo, (item) => ({ ...item }));
  };

  const onSave = () => {
    if (!formData.name.trim()) return;
    handleSave();
  };

  const addDishToCombo = (dish: ComboDish) => {
    if (!formData.dishes.find(d => d.id === dish.id)) {
      setFormData(prev => ({ ...prev, dishes: [...prev.dishes, dish] }));
    }
  };

  const removeDishFromCombo = (id: string) => {
    setFormData(prev => ({ ...prev, dishes: prev.dishes.filter(d => d.id !== id) }));
  };

  const filteredDishes = mockAvailableDishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const calculateOriginalPrice = (dishes: ComboDish[]) => dishes.reduce((sum, d) => sum + d.price, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('menu.constructor.combos.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={onOpenCreate}>
          {t('menu.constructor.combos.addBtn')}
        </Button>
      </div>

      {combos.length === 0 ? (
        <EmptyState icon={<PackagePlus />} title={t('menu.constructor.combos.emptyTitle')} description={t('menu.constructor.combos.emptyDesc')} actionLabel={t('menu.constructor.combos.addBtn')} onAction={onOpenCreate} />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          >
            {combos.map(combo => <ComboCard key={combo.id} combo={combo} onEdit={onOpenEdit} onDelete={setDeleteId} />)}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCombo ? t('menu.constructor.combos.modal.editTitle') : t('menu.constructor.combos.modal.createTitle')}>
        <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
          <Input id="comboName" label={t('menu.constructor.combos.modal.nameLabel')} placeholder={t('menu.constructor.combos.modal.namePlaceholder')} value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />

          <div className="grid grid-cols-2 gap-4">
            <Select id="comboType" label={t('menu.constructor.combos.modal.priceTypeLabel')} value={formData.priceType} onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value as 'FIXED' | 'DISCOUNT' }))}>
              <option value="FIXED">{t('menu.constructor.combos.modal.typeFixed')}</option>
              <option value="DISCOUNT">{t('menu.constructor.combos.modal.typeDiscount')}</option>
            </Select>
            <Input id="comboPriceValue" type="number" label={t('menu.constructor.combos.modal.priceValueLabel')} value={formData.priceValue} onChange={(e) => setFormData(prev => ({ ...prev, priceValue: parseFloat(e.target.value) || 0 }))} />
          </div>

          <div className="border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4">
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('menu.constructor.combos.modal.searchLabel')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
                <input type="text" placeholder={t('menu.constructor.combos.modal.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-11 w-full rounded-md border border-brand-gray/30 dark:border-brand-gray/50 bg-white dark:bg-brand-mocha pl-9 pr-3 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper" />
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 bg-white dark:bg-brand-mocha border border-brand-gray/20 dark:border-brand-gray/20 rounded-lg shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
                {filteredDishes.length > 0 ? filteredDishes.map(dish => (
                  <button key={dish.id} onClick={() => { addDishToCombo(dish); setSearchQuery(''); }} className="w-full flex items-center justify-between p-3 text-left hover:bg-brand-cream/50 dark:hover:bg-white/5 border-b border-brand-gray/10 dark:border-brand-gray/20 last:border-0 outline-none">
                    <span className="text-sm text-brand-espresso dark:text-brand-cream font-medium">{dish.name}</span><span className="text-xs text-brand-gray">{dish.price} {t('menu.currency')}</span>
                  </button>
                )) : <div className="p-4 text-center text-sm text-brand-gray">{t('menu.constructor.combos.modal.notFound')}</div>}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-brand-espresso dark:text-brand-cream mb-2 block">{t('menu.constructor.combos.modal.includedDishes')}</label>
<div className="bg-brand-cream/30 dark:bg-brand-mocha/30 border border-brand-gray/20 dark:border-brand-gray/20 rounded-xl p-3 min-h-25 flex flex-col gap-2">              {formData.dishes.length > 0 ? formData.dishes.map(dish => (
                <div key={dish.id} className="flex items-center justify-between bg-white dark:bg-brand-espresso border border-brand-gray/10 dark:border-brand-gray/20 p-2.5 rounded-lg">
                  <span className="text-sm text-brand-espresso dark:text-brand-cream font-medium">{dish.name}</span>
                  <button onClick={() => removeDishFromCombo(dish.id)} className="text-brand-gray hover:text-red-500 outline-none"><X className="h-4 w-4" /></button>
                </div>
              )) : <div className="flex h-full items-center justify-center text-sm text-brand-gray/60 italic">{t('menu.constructor.combos.modal.emptyIncluded')}</div>}
            </div>
            {formData.dishes.length > 0 && (
              <div className="mt-3 flex justify-between items-center text-sm px-1">
                <span className="text-brand-gray">{t('menu.constructor.combos.modal.originalPrice')}</span><span className="font-medium text-brand-espresso dark:text-brand-cream">{calculateOriginalPrice(formData.dishes)} {t('menu.currency')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('menu.constructor.combos.modal.cancel')}</Button>
          <Button variant="brand" onClick={onSave} disabled={!formData.name.trim() || !formData.dishes.length}>{t('menu.constructor.combos.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('menu.constructor.combos.deleteConfirm')} />
    </div>
  );
};