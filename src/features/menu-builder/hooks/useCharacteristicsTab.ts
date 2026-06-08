'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useDishesLookups } from '@/features/menu-builder/hooks/dishes/useDishesQueries';
import { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import toast from 'react-hot-toast';

export const useCharacteristicsTab = (
  dishForm: DishFormValues,
  setDishForm: React.Dispatch<React.SetStateAction<DishFormValues>>
) => {
  const { t } = useTranslation();
  const { items: allergens, createItem: createAllergen, deleteItem: deleteAllergen } = useDishesLookups('allergens');
  const { items: tags, createItem: createTag, deleteItem: deleteTag } = useDishesLookups('tags');
  
  const [newAllergen, setNewAllergen] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddAllergen = async () => {
    const formatted = newAllergen.trim();
    if (!formatted) return;
    try {
      await createAllergen(formatted);
      const currentAllergens = dishForm.allergens || [];
      if (!currentAllergens.includes(formatted)) {
        setDishForm((prev) => ({ ...prev, allergens: [...(prev.allergens || []), formatted] }));
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
        setDishForm((prev) => ({ ...prev, tags: [...(prev.tags || []), formatted] }));
      }
      setNewTag('');
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.tagSaveFailed'));
    }
  };

  const handleToggleAllergen = (item: string, checked: boolean) => {
    setDishForm((prev) => {
      const current = prev.allergens || [];
      const next = checked ? [...current, item] : current.filter((a) => a !== item);
      return { ...prev, allergens: next };
    });
  };

  const handleToggleTag = (item: string, checked: boolean) => {
    setDishForm((prev) => {
      const current = prev.tags || [];
      const next = checked ? [...current, item] : current.filter((t) => t !== item);
      return { ...prev, tags: next };
    });
  };

  const handleRemoveAllergenFromDb = async (item: string) => {
    try {
      await deleteAllergen(item);
      setDishForm((prev) => ({
        ...prev,
        allergens: (prev.allergens || []).filter((a) => a !== item)
      }));
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.allergenDeleteFailed'));
    }
  };

  const handleRemoveTagFromDb = async (item: string) => {
    try {
      await deleteTag(item);
      setDishForm((prev) => ({
        ...prev,
        tags: (prev.tags || []).filter((t) => t !== item)
      }));
    } catch {
      toast.error(t('menu.constructor.dishes.modal.errors.tagDeleteFailed'));
    }
  };

  return {
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
    handleRemoveTagFromDb,
  };
};