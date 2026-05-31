'use client';

import { useState } from 'react';
import { useInventory } from '../inventory/useInventory';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { InventoryItem } from '../../types/inventory.types';
import { DishFormValues } from '../../schemas/dishes.schema';
import toast from 'react-hot-toast';

export const useIngredientsTabLogic = (dishForm: DishFormValues, setDishForm: React.Dispatch<React.SetStateAction<any>>) => {
  const { t } = useTranslation();
  const { inventoryItems, isLoading } = useInventory();

  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');

  const currentInventoryItem = inventoryItems.find((item: InventoryItem) => item.id === selectedItemId);

  const handleAdd = () => {
    if (!selectedItemId || !quantity || !currentInventoryItem) return;

    const current = dishForm.ingredients || [];
    
    if (current.some((ing: any) => ing.inventoryItemId === selectedItemId)) {
      toast.error(t('menu.constructor.dishes.modal.ingredients.errors.alreadyAdded'));
      return;
    }

    const newItem = {
      name: currentInventoryItem.name,
      quantity: parseFloat(quantity) || 0,
      unit: currentInventoryItem.unit,
      inventoryItemId: selectedItemId,
    };

    setDishForm({ ...dishForm, ingredients: [...current, newItem] });
    setSelectedItemId('');
    setQuantity('');
  };

  const handleRemove = (index: number) => {
    const current = [...(dishForm.ingredients || [])];
    current.splice(index, 1);
    setDishForm({ ...dishForm, ingredients: current });
  };

  return {
    t,
    inventoryItems,
    isLoading,
    selectedItemId,
    setSelectedItemId,
    quantity,
    setQuantity,
    currentInventoryItem,
    handleAdd,
    handleRemove
  };
};