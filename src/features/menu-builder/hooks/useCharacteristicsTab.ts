'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useLookup } from './dishes/useLookup';
import { DishFormValues } from '../schemas/dishes.schema';
import toast from 'react-hot-toast';

export const useCharacteristicsTab = (
  dishForm: DishFormValues,
  setDishForm: React.Dispatch<React.SetStateAction<any>>
) => {
  const { t } = useTranslation();
  const { items: allergens, createItem: createAllergen, deleteItem: deleteAllergen } = useLookup('allergens');
  const { items: tags, createItem: createTag, deleteItem: deleteTag } = useLookup('tags');
  
  const [newAllergen, setNewAllergen] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddAllergen = async () => {
    const formatted = newAllergen.trim();
    if (!formatted) return;
    try {
      await createAllergen(formatted);
      const currentAllergens = dishForm.allergens || [];
      if (!currentAllergens.includes(formatted)) {
        setDishForm({ ...dishForm, allergens: [...currentAllergens, formatted] });
      }
      setNewAllergen('');
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.allergenSaveFailed'));
    }
  };

  const handleAddTag = async () => {
    const formatted = newTag.trim();
    if (!formatted) return;
    try {
      await createTag(formatted);
      const currentTags = dishForm.tags || [];
      if (!currentTags.includes(formatted)) {
        setDishForm({ ...dishForm, tags: [...currentTags, formatted] });
      }
      setNewTag('');
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  };

  const handleToggleAllergen = (item: string, checked: boolean) => {
    const current = dishForm.allergens || [];
    const next = checked ? [...current, item] : current.filter((a: string) => a !== item);
    setDishForm({ ...dishForm, allergens: next });
  };

  const handleToggleTag = (item: string, checked: boolean) => {
    const current = dishForm.tags || [];
    const next = checked ? [...current, item] : current.filter((t: string) => t !== item);
    setDishForm({ ...dishForm, tags: next });
  };

  const handleRemoveAllergenFromDb = async (item: string) => {
    try {
      await deleteAllergen(item);
      const current = dishForm.allergens || [];
      setDishForm({ ...dishForm, allergens: current.filter((a: string) => a !== item) });
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.allergenDeleteFailed'));
    }
  };

  const handleRemoveTagFromDb = async (item: string) => {
    try {
      await deleteTag(item);
      const current = dishForm.tags || [];
      setDishForm({ ...dishForm, tags: current.filter((t: string) => t !== item) });
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  };

  return {
    t,
    allergens,
    tags,
    newAllergen,
    setNewAllergen,
    newTag,
    setNewTag,
    handleAddAllergen,
    handleAddTag,
    handleToggleAllergen,
    handleToggleTag,
    handleRemoveAllergenFromDb,
    handleRemoveTagFromDb
  };
};