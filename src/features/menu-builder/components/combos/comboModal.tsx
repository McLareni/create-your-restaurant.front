'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Modal, Checkbox } from '@/shared/ui';
import { createComboSchema } from '../../schemas/combos.schema';
import { CreateComboDTO } from '../../types/combos.types';
import { useAvailableDishesList } from '../../hooks/useAvailableDishesList';

interface ComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSave: (data: CreateComboDTO) => Promise<void>;
  initialData?: CreateComboDTO;
}

export const ComboModal = ({ isOpen, onClose, isLoading, onSave, initialData }: ComboModalProps) => {
  const { t } = useTranslation();
  const { dishes: availableDishes, isLoading: isDishesLoading } = useAvailableDishesList();
  
  const [name, setName] = useState(initialData?.name || '');
  const [priceType, setPriceType] = useState<'FIXED' | 'DISCOUNT'>(initialData?.priceType || 'FIXED');
  const [priceValue, setPriceValue] = useState(initialData?.priceValue || 0);
  const [selectedDishes, setSelectedDishes] = useState<any[]>(initialData?.dishes || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggleDish = (dish: any, checked: boolean) => {
    if (checked) {
      setSelectedDishes(prev => [...prev, { id: dish.id, name: dish.name, price: dish.price }]);
    } else {
      setSelectedDishes(prev => prev.filter(d => d.id !== dish.id));
    }
  };

  const handleValidateAndSubmit = async () => {
    const payload: CreateComboDTO = { 
      name, 
      priceType, 
      priceValue, 
      dishes: selectedDishes 
    };
    
    const result = createComboSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSave(result.data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('menu.constructor.combos.modal.title')}>
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
        <Input 
          id="combo-name" 
          label={t('menu.constructor.combos.modal.nameLabel')} 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          disabled={isLoading}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}

        <div className="grid grid-cols-2 gap-4">
          <Select 
            id="combo-type" 
            label={t('menu.constructor.combos.modal.priceTypeLabel')} 
            value={priceType} 
            onChange={(e) => setPriceType(e.target.value as any)}
            disabled={isLoading}
          >
            <option value="FIXED">{t('menu.constructor.combos.modal.typeFixed')}</option>
            <option value="DISCOUNT">{t('menu.constructor.combos.modal.typeDiscount')}</option>
          </Select>
          
          <Input 
            id="combo-value" 
            type="number" 
            label={t('menu.constructor.combos.modal.priceValueLabel')} 
            value={priceValue} 
            onChange={(e) => setPriceValue(parseFloat(e.target.value) || 0)} 
            disabled={isLoading}
          />
        </div>
        {errors.priceValue && <span className="text-xs text-red-500">{errors.priceValue}</span>}

        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
            {t('menu.constructor.combos.modal.includedDishes')}
          </label>
          {errors.dishes && <span className="text-xs text-red-500">{errors.dishes}</span>}
          
          <div className="grid grid-cols-1 gap-2 p-3 rounded-xl border border-brand-gray/10 bg-brand-cream/5 max-h-48 overflow-y-auto custom-scrollbar">
            {isDishesLoading ? (
              <span className="text-xs text-brand-gray animate-pulse">{t('loading')}</span>
            ) : availableDishes.length === 0 ? (
              <span className="text-xs text-brand-gray italic">{t('menu.constructor.combos.modal.notFound')}</span>
            ) : (
              availableDishes.map((dish) => (
                <div key={dish.id} className="bg-white dark:bg-brand-mocha p-2 rounded-lg border border-brand-gray/10 flex items-center justify-between">
                  <Checkbox
                    id={`combo-dish-${dish.id}`}
                    label={<span className="text-xs font-semibold">{dish.name}</span>}
                    checked={selectedDishes.some(d => d.id === dish.id)}
                    onChange={(e) => handleToggleDish(dish, e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="text-xs font-mono text-brand-copper font-bold">{dish.price} ₴</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {t('menu.constructor.combos.modal.cancel')}
        </Button>
        <Button variant="brand" onClick={handleValidateAndSubmit} isLoading={isLoading} disabled={isLoading}>
          {t('menu.constructor.combos.modal.save')}
        </Button>
      </div>
    </Modal>
  );
};