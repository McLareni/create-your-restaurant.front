'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Modal, ConfirmModal } from '@/shared/ui';
import { PackagePlus, Plus, Search, X } from 'lucide-react';
import { useCombos } from '../hooks/useCombos';
import { mockAvailableDishes } from '../api/combos.api';
import { Combo, CreateComboDTO, ComboDish } from '../types/combos.types';
import { ComboCard } from './comboCard';

const INITIAL_FORM_DATA: CreateComboDTO = { name: '', priceType: 'FIXED', priceValue: 0, dishes: [] };

export const CombosTab = () => {
  const { t } = useTranslation();
  const { combos, createCombo, updateCombo, deleteCombo } = useCombos();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [formData, setFormData] = useState<CreateComboDTO>(INITIAL_FORM_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCombo(null);
    setFormData(INITIAL_FORM_DATA);
    setSearchQuery('');
    setIsModalOpen(true);
  };

  const openEditModal = (combo: Combo) => {
    setEditingCombo(combo);
    setFormData({ ...combo });
    setSearchQuery('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingCombo) updateCombo(editingCombo.id, formData);
    else createCombo(formData);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCombo(deleteId);
      setDeleteId(null);
    }
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

  const selectBaseClasses = "h-12 w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-espresso outline-none transition-colors border-brand-gray/30 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10">
        <h2 className="text-xl font-semibold text-brand-espresso">{t('menu.constructor.combos.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          {t('menu.constructor.combos.addBtn')}
        </Button>
      </div>

      {combos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center border-2 border-dashed border-brand-gray/20 rounded-xl bg-brand-cream/30">
          <PackagePlus className="h-12 w-12 text-brand-gray/40 mb-3" />
          <h3 className="text-lg font-medium text-brand-espresso mb-1">{t('menu.constructor.combos.emptyTitle')}</h3>
          <p className="text-sm text-brand-gray max-w-sm mb-4">{t('menu.constructor.combos.emptyDesc')}</p>
          <Button variant="outline" onClick={openCreateModal}>{t('menu.constructor.combos.addBtn')}</Button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          {combos.map(combo => <ComboCard key={combo.id} combo={combo} onEdit={openEditModal} onDelete={setDeleteId} />)}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCombo ? t('menu.constructor.combos.modal.editTitle') : t('menu.constructor.combos.modal.createTitle')}>
        <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
          <Input id="comboName" label={t('menu.constructor.combos.modal.nameLabel')} placeholder={t('menu.constructor.combos.modal.namePlaceholder')} value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-espresso">{t('menu.constructor.combos.modal.priceTypeLabel')}</label>
              <select className={selectBaseClasses} value={formData.priceType} onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value as 'FIXED' | 'DISCOUNT' }))}>
                <option value="FIXED">{t('menu.constructor.combos.modal.typeFixed')}</option>
                <option value="DISCOUNT">{t('menu.constructor.combos.modal.typeDiscount')}</option>
              </select>
            </div>
            <Input id="comboPriceValue" type="number" label={t('menu.constructor.combos.modal.priceValueLabel')} value={formData.priceValue} onChange={(e) => setFormData(prev => ({ ...prev, priceValue: parseFloat(e.target.value) || 0 }))} />
          </div>

          <div className="border-t border-brand-gray/10 pt-4">
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="text-sm font-medium text-brand-espresso">{t('menu.constructor.combos.modal.searchLabel')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60" />
                <input type="text" placeholder={t('menu.constructor.combos.modal.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-11 w-full rounded-md border border-brand-gray/30 bg-white pl-9 pr-3 text-sm text-brand-espresso outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper" />
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 bg-white border border-brand-gray/20 rounded-lg shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
                {filteredDishes.length > 0 ? filteredDishes.map(dish => (
                  <button key={dish.id} onClick={() => { addDishToCombo(dish); setSearchQuery(''); }} className="w-full flex items-center justify-between p-3 text-left hover:bg-brand-cream/50 border-b border-brand-gray/10 last:border-0 outline-none">
                    <span className="text-sm text-brand-espresso font-medium">{dish.name}</span><span className="text-xs text-brand-gray">{dish.price} ₴</span>
                  </button>
                )) : <div className="p-4 text-center text-sm text-brand-gray">Страви не знайдено</div>}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-brand-espresso mb-2 block">{t('menu.constructor.combos.modal.includedDishes')}</label>
            <div className="bg-brand-cream/30 border border-brand-gray/20 rounded-xl p-3 min-h-[100px] flex flex-col gap-2">
              {formData.dishes.length > 0 ? formData.dishes.map(dish => (
                <div key={dish.id} className="flex items-center justify-between bg-white border border-brand-gray/10 p-2.5 rounded-lg">
                  <span className="text-sm text-brand-espresso font-medium">{dish.name}</span>
                  <button onClick={() => removeDishFromCombo(dish.id)} className="text-brand-gray hover:text-red-500 outline-none"><X className="h-4 w-4" /></button>
                </div>
              )) : <div className="flex h-full items-center justify-center text-sm text-brand-gray/60 italic">{t('menu.constructor.combos.modal.emptyIncluded')}</div>}
            </div>
            {formData.dishes.length > 0 && (
              <div className="mt-3 flex justify-between items-center text-sm px-1">
                <span className="text-brand-gray">Вартість без комбо:</span><span className="font-medium text-brand-espresso">{calculateOriginalPrice(formData.dishes)} ₴</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-brand-gray/10">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('menu.constructor.combos.modal.cancel')}</Button>
          <Button variant="brand" onClick={handleSave} disabled={!formData.name.trim() || !formData.dishes.length}>{t('menu.constructor.combos.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete}
        description="Ви впевнені, що хочете видалити цей набір? Він зникне з меню для всіх гостей."
      />
    </div>
  );
};