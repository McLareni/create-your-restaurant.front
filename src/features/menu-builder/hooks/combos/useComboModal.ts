'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useAvailableDishesList } from '../dishes/useAvailableDishesList';
import { createComboSchema } from '../../schemas/combos.schema';
import { CreateComboDTO } from '../../types/combos.types';
import toast from 'react-hot-toast';

export const useComboModal = (
  initialData: CreateComboDTO | undefined,
  onSave: (data: CreateComboDTO) => Promise<void>,
  onClose: () => void
) => {
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
      name: name.trim(), 
      priceType, 
      priceValue: Number(priceValue), 
      dishes: selectedDishes 
    };
    
    const result = createComboSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = t(issue.message);
      });
      setErrors(fieldErrors);
      toast.error(t('errors.formValidation'));
      return;
    }

    setErrors({});
    try {
      await onSave(result.data);
      onClose();
    } catch {
      toast.error(t('auth.errors.defaultError'));
    }
  };

  return {
    t,
    name,
    setName,
    priceType,
    setPriceType,
    priceValue,
    setPriceValue,
    selectedDishes,
    errors,
    allDishes,
    isDishesLoading,
    handleAddDish,
    handleToggleDish,
    handleValidateAndSubmit
  };
};