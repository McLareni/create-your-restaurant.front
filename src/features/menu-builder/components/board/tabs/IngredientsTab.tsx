'use client';

import { useState } from 'react';
import { Input, Button, Select } from '@/shared/ui';
import { Plus, Trash2, Carrot } from 'lucide-react';
import { DishFormValues } from '../../../schemas/dishes.schema';

interface IngredientsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
}

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('г');

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
      <span className="text-xs font-semibold flex items-center gap-2">
        <Carrot className="h-4 w-4 text-brand-copper" /> Складники та вагові пропорції страви
      </span>
      <div className="grid grid-cols-12 gap-2 items-end bg-brand-cream/10 p-2.5 rounded-xl border border-brand-gray/10">
        <div className="col-span-6">
          <Input
            id="ing-name"
            label="Назва"
            placeholder="Напр. Сир Моцарела"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        <div className="col-span-3">
          <Input
            id="ing-qty"
            type="number"
            label="Кількість"
            placeholder="50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-9 text-xs text-center"
          />
        </div>
        <div className="col-span-2">
          <Select
            id="ing-unit"
            label="Од."
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="г">г</option>
            <option value="мл">мл</option>
            <option value="шт">шт</option>
            <option value="кг">кг</option>
          </Select>
        </div>
        <div className="col-span-1">
          <Button variant="brand" type="button" onClick={handleAdd} className="h-9 w-full rounded-md px-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 max-h-44 overflow-y-auto custom-scrollbar flex-1">
        {(!dishForm.ingredients || dishForm.ingredients.length === 0) ? (
          <span className="text-xs text-brand-gray italic p-2 text-center block">Рецептурний склад не заповнено</span>
        ) : (
          dishForm.ingredients.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white dark:bg-brand-mocha border border-brand-gray/10 px-3 py-1.5 rounded-xl shadow-xs animate-in slide-in-from-bottom-1">
              <span className="text-xs font-bold text-brand-espresso dark:text-brand-cream">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-brand-cream/50 dark:bg-brand-gray/20 px-2 py-0.5 rounded text-brand-copper font-bold">
                  {item.quantity} {item.unit}
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