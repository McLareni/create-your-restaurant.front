'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input, Checkbox, Select } from '@/shared/ui';
import { Leaf, Flame, MilkOff, ImagePlus, X, Layers } from 'lucide-react';

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  dishForm: any;
  setDishForm: (form: any) => void;
  onSave: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modifierGroups: any[];
}

export const DishModal = ({ isOpen, onClose, isEditing, dishForm, setDishForm, onSave, handleImageUpload, modifierGroups }: DishModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('menu.constructor.dishes.modal.editTitle') : t('menu.constructor.dishes.modal.createTitle')}>
      <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-brand-espresso dark:text-brand-cream">{t('menu.constructor.dishes.modal.media')}</span>
          <div className="relative w-full h-32 rounded-xl border border-dashed border-brand-gray/30 dark:border-brand-gray/50 hover:border-brand-copper hover:bg-brand-copper/5 transition-colors overflow-hidden group">
            <input type="file" id="dish-image" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <label htmlFor="dish-image" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-brand-cream/20">
              {dishForm.image ? (
                <>
                  <img src={dishForm.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">Змінити</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); setDishForm({...dishForm, image: ''}); }} 
                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 outline-none shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-brand-gray">
                  <ImagePlus className="h-6 w-6 mb-1.5 opacity-70" />
                  <span className="text-xs font-medium">{t('menu.constructor.dishes.modal.mediaHint')}</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Input id="dishName" label={t('menu.constructor.dishes.modal.nameLabel')} value={dishForm.name} onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-espresso dark:text-brand-cream">{t('menu.constructor.dishes.modal.descLabel')}</label>
            <textarea className="w-full rounded-lg border border-brand-gray/30 dark:border-brand-gray/50 bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none focus:border-brand-copper focus:ring-1 focus:ring-brand-copper transition-all h-20 resize-none" placeholder={t('menu.constructor.dishes.modal.descPlaceholder')} value={dishForm.description} onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })} />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Input id="dishPrice" type="number" label={t('menu.constructor.dishes.modal.priceLabel')} value={dishForm.price || ''} onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })} />
            <Input id="dishWeight" label={t('menu.constructor.dishes.modal.weightLabel')} placeholder={t('menu.constructor.dishes.modal.weightPlaceholder')} value={dishForm.weight} onChange={(e) => setDishForm({ ...dishForm, weight: e.target.value })} />
            <Input id="dishTime" type="number" label={t('menu.constructor.dishes.modal.timeLabel')} placeholder={t('menu.constructor.dishes.modal.timePlaceholder')} value={dishForm.cookingTime} onChange={(e) => setDishForm({ ...dishForm, cookingTime: e.target.value })} />
            <Input id="dishCals" type="number" label={t('menu.constructor.dishes.modal.caloriesLabel')} placeholder={t('menu.constructor.dishes.modal.caloriesPlaceholder')} value={dishForm.calories} onChange={(e) => setDishForm({ ...dishForm, calories: e.target.value })} />
          </div>

          <Input 
            id="allergens" 
            label="Алергени (через кому)" 
            placeholder="Наприклад: лактоза, арахіс, мед..." 
            value={Array.isArray(dishForm.allergens) ? dishForm.allergens.join(', ') : dishForm.allergens} 
            onChange={(e) => setDishForm({ 
              ...dishForm, 
              allergens: e.target.value.split(',').map((a: string) => a.trim()).filter(Boolean) 
            })} 
          />

          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-xs font-medium text-brand-espresso dark:text-brand-cream flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand-copper" />
              Додати модифікатори
            </span>
            {modifierGroups.length === 0 ? (
              <p className="text-xs text-brand-gray border border-dashed border-brand-gray/20 rounded-lg p-3 text-center">
                У вас ще немає груп модифікаторів.
              </p>
            ) : (
              <div className="flex flex-col gap-2 p-3 rounded-lg border border-brand-gray/10 bg-brand-cream/10 dark:bg-brand-gray/5">
                {modifierGroups.map(group => (
                  <Checkbox 
                    key={group.id}
                    id={`mod-${group.id}`} 
                    label={<span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{group.name}</span>} 
                    checked={dishForm.modifierGroupIds.includes(group.id)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDishForm({ ...dishForm, modifierGroupIds: [...dishForm.modifierGroupIds, group.id] });
                      } else {
                        setDishForm({ ...dishForm, modifierGroupIds: dishForm.modifierGroupIds.filter((id: string) => id !== group.id) });
                      }
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 p-3 bg-brand-cream/40 dark:bg-brand-mocha/40 rounded-lg border border-brand-gray/15 mt-1">
            <Checkbox id="isVegan" label={<span className="flex items-center gap-1.5 text-xs font-medium"><Leaf className="h-3.5 w-3.5 text-green-500"/> {t('menu.constructor.dishes.modal.tags.vegan')}</span>} checked={dishForm.isVegan} onChange={(e) => setDishForm({ ...dishForm, isVegan: e.target.checked })} />
            <Checkbox id="isSpicy" label={<span className="flex items-center gap-1.5 text-xs font-medium"><Flame className="h-3.5 w-3.5 text-red-500"/> {t('menu.constructor.dishes.modal.tags.spicy')}</span>} checked={dishForm.isSpicy} onChange={(e) => setDishForm({ ...dishForm, isSpicy: e.target.checked })} />
            <Checkbox id="isLactoseFree" label={<span className="flex items-center gap-1.5 text-xs font-medium"><MilkOff className="h-3.5 w-3.5 text-blue-400"/> {t('menu.constructor.dishes.modal.tags.lactoseFree')}</span>} checked={dishForm.isLactoseFree} onChange={(e) => setDishForm({ ...dishForm, isLactoseFree: e.target.checked })} />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Select id="dishBadge" label={t('menu.constructor.dishes.modal.badgeLabel')} value={dishForm.badge} onChange={(e) => setDishForm({ ...dishForm, badge: e.target.value })}>
              <option value="NONE">{t('menu.constructor.badges.NONE')}</option>
              <option value="NEW">{t('menu.constructor.badges.NEW')}</option>
              <option value="HIT">{t('menu.constructor.badges.HIT')}</option>
              <option value="CHEF_CHOICE">{t('menu.constructor.badges.CHEF_CHOICE')}</option>
              <option value="TOP_RATED">{t('menu.constructor.badges.TOP_RATED')}</option>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-3 border-t border-brand-gray/10">
        <Button variant="ghost" className="h-9 text-sm" onClick={onClose}>{t('menu.constructor.dishes.modal.cancel')}</Button>
        <Button variant="brand" className="h-9 text-sm" onClick={onSave} disabled={!dishForm.name.trim() || !dishForm.price}>
          {t('menu.constructor.dishes.modal.save')}
        </Button>
      </div>
    </Modal>
  );
};