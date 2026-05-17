'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Modal, Checkbox, ConfirmModal } from '@/shared/ui';
import { Pizza, Plus, ImagePlus, Flame, Leaf, MilkOff } from 'lucide-react';
import { MenuEmptyState } from './menuEmptyState';
import { useDishes } from '../hooks/useDishes';
import { Dish, CreateDishDTO } from '../types/dishes.types';
import { DishCard } from './dishCard';

const INITIAL_FORM_DATA: CreateDishDTO = {
  name: '', description: '', price: 0, weight: '', cookingTime: '', calories: '',
  isVegan: false, isSpicy: false, isLactoseFree: false, badge: 'NONE', allergens: [],
  isAvailable: true, stockQuantity: null, productionZone: null
};

export const DishesTab = () => {
  const { t } = useTranslation();
  const { dishes, createDish, updateDish, deleteDish } = useDishes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState<CreateDishDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateModal = () => { setEditingDish(null); setFormData(INITIAL_FORM_DATA); setIsModalOpen(true); };
  const openEditModal = (dish: Dish) => { setEditingDish(dish); setFormData({ ...dish }); setIsModalOpen(true); };

  const handleChange = (field: keyof CreateDishDTO, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) return;
    if (editingDish) updateDish({ id: editingDish.id, data: formData });
    else createDish(formData);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) { deleteDish(deleteId); setDeleteId(null); }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10">
        <h2 className="text-xl font-semibold text-brand-espresso">{t('menu.constructor.dishes.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          {t('menu.constructor.dishes.addBtn')}
        </Button>
      </div>

      {dishes.length === 0 ? (
        <MenuEmptyState icon={<Pizza />} title={t('menu.constructor.dishes.emptyTitle')} description={t('menu.constructor.dishes.emptyDesc')} actionLabel={t('menu.constructor.dishes.addBtn')} onAction={openCreateModal} />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map(dish => <DishCard key={dish.id} dish={dish} onEdit={openEditModal} onDelete={setDeleteId} />)}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDish ? t('menu.constructor.dishes.modal.editTitle') : t('menu.constructor.dishes.modal.createTitle')}>
        <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
          <div>
            <h4 className="text-sm font-bold text-brand-espresso mb-3 uppercase tracking-wider">{t('menu.constructor.dishes.modal.media')}</h4>
            <div className="border-2 border-dashed border-brand-gray/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-cream/50 transition-colors">
              <ImagePlus className="h-8 w-8 text-brand-gray mb-2" />
              <p className="text-sm text-brand-gray">{t('menu.constructor.dishes.modal.mediaHint')}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-espresso mb-3 uppercase tracking-wider">{t('menu.constructor.dishes.modal.basicInfo')}</h4>
            <div className="flex flex-col gap-4">
              <Input id="dishName" label={t('menu.constructor.dishes.modal.nameLabel')} placeholder={t('menu.constructor.dishes.modal.namePlaceholder')} value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-espresso">{t('menu.constructor.dishes.modal.descLabel')}</label>
                <textarea className="w-full rounded-md border border-brand-gray/30 bg-white px-3 py-2 text-sm text-brand-espresso outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper resize-none h-24" placeholder={t('menu.constructor.dishes.modal.descPlaceholder')} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input id="dishPrice" type="number" label={t('menu.constructor.dishes.modal.priceLabel')} value={formData.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value))} />
                <Input id="dishWeight" label={t('menu.constructor.dishes.modal.weightLabel')} placeholder={t('menu.constructor.dishes.modal.weightPlaceholder')} value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} />
                <Input id="dishTime" type="number" label={t('menu.constructor.dishes.modal.timeLabel')} placeholder={t('menu.constructor.dishes.modal.timePlaceholder')} value={formData.cookingTime} onChange={(e) => handleChange('cookingTime', e.target.value)} />
                <Input id="dishCals" label={t('menu.constructor.dishes.modal.caloriesLabel')} placeholder={t('menu.constructor.dishes.modal.caloriesPlaceholder')} value={formData.calories} onChange={(e) => handleChange('calories', e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-espresso mb-3 uppercase tracking-wider">{t('menu.constructor.dishes.modal.properties')}</h4>
            <div className="flex gap-6 mb-4 bg-brand-cream/40 p-3 rounded-lg border border-brand-gray/10">
              <Checkbox id="isVegan" label={<span className="flex items-center gap-1.5"><Leaf className="h-3 w-3 text-green-500"/> {t('menu.constructor.dishes.modal.tags.vegan')}</span>} checked={formData.isVegan} onChange={(e) => handleChange('isVegan', e.target.checked)} />
              <Checkbox id="isSpicy" label={<span className="flex items-center gap-1.5"><Flame className="h-3 w-3 text-red-500"/> {t('menu.constructor.dishes.modal.tags.spicy')}</span>} checked={formData.isSpicy} onChange={(e) => handleChange('isSpicy', e.target.checked)} />
              <Checkbox id="isLactoseFree" label={<span className="flex items-center gap-1.5"><MilkOff className="h-3 w-3 text-blue-400"/> {t('menu.constructor.dishes.modal.tags.lactoseFree')}</span>} checked={formData.isLactoseFree} onChange={(e) => handleChange('isLactoseFree', e.target.checked)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select id="dishBadge" label={t('menu.constructor.dishes.modal.badgeLabel')} value={formData.badge} onChange={(e) => handleChange('badge', e.target.value)}>
                <option value="NONE">{t('menu.constructor.badges.NONE')}</option>
                <option value="NEW">{t('menu.constructor.badges.NEW')}</option>
                <option value="HIT">{t('menu.constructor.badges.HIT')}</option>
                <option value="CHEF_CHOICE">{t('menu.constructor.badges.CHEF_CHOICE')}</option>
                <option value="TOP_RATED">{t('menu.constructor.badges.TOP_RATED')}</option>
              </Select>
              <Select id="dishAllergens" label={t('menu.constructor.dishes.modal.allergensLabel')} defaultValue="">
                <option value="" disabled>{t('menu.constructor.dishes.modal.allergensPlaceholder')}</option>
                <option value="gluten">Глютен</option>
                <option value="lactose">Лактоза</option>
                <option value="nuts">Горіхи</option>
                <option value="seafood">Морепродукти</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-brand-gray/10">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('menu.constructor.dishes.modal.cancel')}</Button>
          <Button variant="brand" onClick={handleSave} disabled={!formData.name.trim() || !formData.price}>{t('menu.constructor.dishes.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('menu.constructor.dishes.deleteConfirm')} />
    </div>
  );
};