'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Modal, ConfirmModal } from '@/shared/ui';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { MenuEmptyState } from './menuEmptyState';
import { useModifiers } from '../hooks/useModifiers';
import { ModifierGroup, CreateModifierDTO, ModifierOption } from '../types/modifiers.types';
import { ModifierCard } from './modifierCard';

const INITIAL_FORM_DATA: CreateModifierDTO = { name: '', type: 'GROUP', minSelect: 0, maxSelect: 1, options: [] };

export const ModifiersTab = () => {
  const { t } = useTranslation();
  const { modifiers, createModifier, updateModifier, deleteModifier } = useModifiers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<ModifierGroup | null>(null);
  const [formData, setFormData] = useState<CreateModifierDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateModal = () => { setEditingMod(null); setFormData({ ...INITIAL_FORM_DATA, options: [{ id: Date.now().toString(), name: '', price: 0 }] }); setIsModalOpen(true); };
  const openEditModal = (mod: ModifierGroup) => { setEditingMod(mod); setFormData({ ...mod }); setIsModalOpen(true); };

  const handleOptionChange = (id: string, field: keyof ModifierOption, value: any) => {
    setFormData(prev => ({ ...prev, options: prev.options.map(opt => opt.id === id ? { ...opt, [field]: value } : opt) }));
  };

  const addOption = () => setFormData(prev => ({ ...prev, options: [...prev.options, { id: Date.now().toString(), name: '', price: 0 }] }));
  const removeOption = (id: string) => setFormData(prev => ({ ...prev, options: prev.options.filter(opt => opt.id !== id) }));

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingMod) updateModifier({ id: editingMod.id, data: formData });
    else createModifier(formData);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) { deleteModifier(deleteId); setDeleteId(null); }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10">
        <h2 className="text-xl font-semibold text-brand-espresso">{t('menu.constructor.modifiers.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          {t('menu.constructor.modifiers.addBtn')}
        </Button>
      </div>

      {modifiers.length === 0 ? (
        <MenuEmptyState icon={<Layers />} title={t('menu.constructor.modifiers.emptyTitle')} description={t('menu.constructor.modifiers.emptyDesc')} actionLabel={t('menu.constructor.modifiers.addBtn')} onAction={openCreateModal} />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          {modifiers.map(mod => <ModifierCard key={mod.id} modifier={mod} onEdit={openEditModal} onDelete={setDeleteId} />)}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMod ? t('menu.constructor.modifiers.modal.editTitle') : t('menu.constructor.modifiers.modal.createTitle')}>
        <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
          <Input id="modName" label={t('menu.constructor.modifiers.modal.nameLabel')} placeholder={t('menu.constructor.modifiers.modal.namePlaceholder')} value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
          
          <Select id="modType" label={t('menu.constructor.modifiers.modal.typeLabel')} value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'SINGLE' | 'GROUP' }))}>
            <option value="GROUP">{t('menu.constructor.modifiers.modal.typeGroup')}</option>
            <option value="SINGLE">{t('menu.constructor.modifiers.modal.typeSingle')}</option>
          </Select>
          
          {formData.type === 'GROUP' && (
            <div className="flex gap-4">
              <div className="flex-1"><Input id="minSelect" type="number" label={t('menu.constructor.modifiers.modal.minSelect')} value={formData.minSelect} onChange={(e) => setFormData(prev => ({ ...prev, minSelect: parseInt(e.target.value) || 0 }))} /></div>
              <div className="flex-1"><Input id="maxSelect" type="number" label={t('menu.constructor.modifiers.modal.maxSelect')} value={formData.maxSelect} onChange={(e) => setFormData(prev => ({ ...prev, maxSelect: parseInt(e.target.value) || 1 }))} /></div>
            </div>
          )}
          
          <div className="pt-2 border-t border-brand-gray/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-brand-espresso">{t('menu.constructor.modifiers.modal.optionsLabel')}</label>
              <button type="button" onClick={addOption} className="text-xs font-medium text-brand-copper hover:text-brand-gold outline-none flex items-center gap-1"><Plus className="h-3 w-3" /> {t('menu.constructor.modifiers.modal.addOptionBtn')}</button>
            </div>
            <div className="flex flex-col gap-3">
              {formData.options.map((opt) => (
                <div key={opt.id} className="flex gap-3 items-start">
                  <div className="flex-1"><Input id={`opt-name-${opt.id}`} placeholder={t('menu.constructor.modifiers.modal.optionNamePlaceholder')} value={opt.name} onChange={(e) => handleOptionChange(opt.id, 'name', e.target.value)} /></div>
                  <div className="w-24"><Input id={`opt-price-${opt.id}`} type="number" placeholder={t('menu.constructor.modifiers.modal.optionPricePlaceholder')} value={opt.price} onChange={(e) => handleOptionChange(opt.id, 'price', parseFloat(e.target.value))} /></div>
                  {formData.options.length > 1 && (
                    <button onClick={() => removeOption(opt.id)} className="mt-2 p-2 text-brand-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors outline-none"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-brand-gray/10">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('menu.constructor.modifiers.modal.cancel')}</Button>
          <Button variant="brand" onClick={handleSave} disabled={!formData.name.trim()}>{t('menu.constructor.modifiers.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('menu.constructor.modifiers.deleteConfirm')} />
    </div>
  );
};