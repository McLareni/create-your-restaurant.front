'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Select, Checkbox } from '@/shared/ui';
import { createComboSchema } from '../../schemas/combos.schema';
import { CreateComboDTO } from '../../types/combos.types';
import { useAvailableDishesList } from '../../hooks/useAvailableDishesList';
import toast from 'react-hot-toast';

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
  
  const [name, setName] = useState(initialData?.name ?? '');
  const [priceType, setPriceType] = useState<'FIXED' | 'DISCOUNT'>(initialData?.priceType ?? 'FIXED');
  const [priceValue, setPriceValue] = useState(initialData?.priceValue ?? 0);
  const [selectedDishes, setSelectedDishes] = useState<any[]>(initialData?.dishes ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allDishes = availableDishes || [];

  const handleAddDish = (dishId: string) => {
    if (!dishId) return;
    const targetDish = allDishes.find((d: any) => d.id === dishId);
    if (!targetDish) return;

    if (selectedDishes.some((d: any) => d.id === dishId)) return;

    setSelectedDishes(prev => [...prev, { id: targetDish.id, name: targetDish.name, price: targetDish.price }]);
  };

  const handleToggleDish = (dish: any, checked: boolean) => {
    if (!checked) {
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
    try {
      await onSave(result.data);
      onClose();
    } catch (error) {
      toast.error(t('auth.errors.defaultError'));
    }
  };

  return (
    <FloatingPanel
      panelId="combo-pack-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.name ? t('menu.constructor.combos.modal.editTitle') : t('menu.constructor.combos.modal.createTitle')}
      className="w-160 border-brand-copper/20"
    >
      <div className="flex flex-col text-brand-espresso dark:text-brand-cream w-full h-162.5 max-h-[calc(100vh-140px)] justify-start gap-4 overflow-hidden">
        
        <Input 
          id="combo-name" 
          label={t('menu.constructor.combos.modal.nameLabel')} 
          placeholder={t('menu.constructor.combos.modal.namePlaceholder')}
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          disabled={isLoading}
        />
        {errors.name && <span className="text-xs text-red-500 -mt-2">{errors.name}</span>}

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
            value={priceValue === 0 ? '' : priceValue} 
            onChange={(e) => setPriceValue(Math.max(0, parseFloat(e.target.value) || 0))} 
            disabled={isLoading}
          />
        </div>
        {errors.priceValue && <span className="text-xs text-red-500 -mt-2">{errors.priceValue}</span>}

        <div className="flex flex-col gap-2 mt-1 overflow-hidden flex-1">
          <div className="flex flex-col gap-1.5">
            <Select
              id="dishSelector"
              label={t('menu.constructor.combos.modal.searchLabel')}
              value=""
              onChange={(e) => {
                handleAddDish(e.target.value);
                e.target.value = "";
              }}
              disabled={isLoading || isDishesLoading}
            >
              <option value="" disabled hidden>{t('menu.constructor.combos.modal.searchPlaceholder')}</option>
              {allDishes
                .filter((d: any) => !(selectedDishes || []).some((fd: any) => fd.id === d.id))
                .map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {`${d.name} (${d.price} ${t('menu.constructor.dishes.modal.priceLabel')})`}
                  </option>
                ))
              }
            </Select>
          </div>

          <label className="text-sm font-semibold text-brand-espresso dark:text-brand-cream mt-2">
            {t('menu.constructor.combos.modal.includedDishes')}
          </label>
          {errors.dishes && <span className="text-xs text-red-500">{errors.dishes}</span>}
          
          <div className="grid grid-cols-1 gap-2 p-3 rounded-xl border border-brand-gray/10 bg-brand-cream/5 overflow-y-auto custom-scrollbar flex-1 max-h-85">
            {isDishesLoading ? (
              <span className="text-xs text-brand-gray animate-pulse">{t('loading')}</span>
            ) : selectedDishes.length === 0 ? (
              <span className="text-xs text-brand-gray italic">
                {t('menu.constructor.combos.modal.emptyIncluded')}
              </span>
            ) : (
              selectedDishes.map((dish: any) => (
                <div key={dish.id} className="bg-white dark:bg-brand-mocha p-2 rounded-lg border border-brand-gray/10 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-brand-espresso dark:text-brand-cream">{dish.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-copper">{dish.price} {t('menu.currency')}</span>
                    <Checkbox
                      id={`combo-dish-${dish.id}`}
                      label=""
                      checked={true}
                      onChange={(e) => handleToggleDish(dish, e.target.checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 mt-auto border-t border-brand-gray/10 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isLoading} className="h-9 text-xs font-semibold">
            {t('menu.constructor.combos.modal.cancel')}
          </Button>
          <Button 
            variant="brand" 
            onClick={handleValidateAndSubmit} 
            isLoading={isLoading} 
            disabled={isLoading || !name.trim() || selectedDishes.length === 0}
            className="px-5 h-9 text-xs font-bold shadow-md"
          >
            {t('menu.constructor.combos.modal.save')}
          </Button>
        </div>
      </div>
    </FloatingPanel>
  );
};