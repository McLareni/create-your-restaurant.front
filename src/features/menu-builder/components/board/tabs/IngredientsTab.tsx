'use client';

import { useState } from 'react';
import { Input, Button, Select } from '@/shared/ui';
import { Plus, Trash2, Carrot } from 'lucide-react';
import { DishFormValues } from '../../../schemas/dishes.schema';
import { useTranslation } from '@/shared/hooks/useTranslation';

interface IngredientsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
}

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');

  const handleAdd = () => {
    if (!name.trim() || !quantity) return;
    const current = dishForm.ingredients || [];
    const newItem = {
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      unit: unit
    };
    setDishForm({ ...dishForm, ingredients: [...current, newItem] });
    setName('');
    setQuantity('');
  };

  const handleRemove = (index: number) => {
    const current = [...(dishForm.ingredients || [])];
    current.splice(index, 1);
    setDishForm({ ...dishForm, ingredients: current });
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-100 h-full overflow-hidden">
      <span className="text-xs font-semibold flex items-center gap-2 shrink-0">
        <Carrot className="h-4 w-4 text-brand-copper" /> {t('menu.constructor.dishes.modal.ingredients.title')}
      </span>
      <div className="grid grid-cols-12 gap-2 items-end bg-brand-cream/10 p-2.5 rounded-xl border border-brand-gray/10 shrink-0">
        <div className="col-span-6">
          <Input
            id="ing-name"
            label={t('menu.constructor.dishes.modal.ingredients.nameLabel')}
            placeholder={t('menu.constructor.dishes.modal.ingredients.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        <div className="col-span-3">
          <Input
            id="ing-qty"
            type="number"
            label={t('menu.constructor.dishes.modal.ingredients.qtyLabel')}
            placeholder="50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-9 text-xs text-center"
          />
        </div>
        <div className="col-span-2">
          <Select
            id="ing-unit"
            label={t('menu.constructor.dishes.modal.ingredients.unitLabel')}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="g">{t('menu.constructor.dishes.modal.ingredients.units.g')}</option>
            <option value="ml">{t('menu.constructor.dishes.modal.ingredients.units.ml')}</option>
            <option value="pcs">{t('menu.constructor.dishes.modal.ingredients.units.pcs')}</option>
            <option value="kg">{t('menu.constructor.dishes.modal.ingredients.units.kg')}</option>
          </Select>
        </div>
        <div className="col-span-1">
          <Button variant="brand" type="button" onClick={handleAdd} className="h-9 w-full rounded-md px-0">
            <Plus className="h-4 w-full" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 flex-1 overflow-y-auto custom-scrollbar">
        {(!dishForm.ingredients || dishForm.ingredients.length === 0) ? (
          <span className="text-xs text-brand-gray italic p-2 text-center block my-auto">{t('menu.constructor.dishes.modal.ingredients.empty')}</span>
        ) : (
          dishForm.ingredients.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white dark:bg-brand-mocha border border-brand-gray/10 px-3 py-1.5 rounded-xl shadow-xs animate-in slide-in-from-bottom-1 shrink-0">
              <span className="text-xs font-bold text-brand-espresso dark:text-brand-cream">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-brand-cream/50 dark:bg-brand-gray/20 px-2 py-0.5 rounded text-brand-copper font-bold">
                  {item.quantity} {t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`)}
                </span>
                <button type="button" onClick={() => handleRemove(idx)} className="text-brand-gray hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};