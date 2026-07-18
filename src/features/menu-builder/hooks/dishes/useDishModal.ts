'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { dishSchema, INITIAL_DISH_FORM } from '@/features/menu-builder/schemas/dishes.schema';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { formatZodErrors } from '@/shared/utils/validation';
import { useDishMediaGallery } from '@/features/menu-builder/hooks/dishes/useDishMediaGallery';
import { useModifierGroupsQuery } from '@/features/menu-builder/hooks/modifiers/useModifierGroupsQuery';
import { useAppActionState } from '@/shared/hooks/useAppActionState';
import toast from 'react-hot-toast';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import type { Dish, UseDishModalProps, UseDishModalReturn } from '@/features/menu-builder/types/dishes.types';

export const useDishModal = ({ createDishAsync, updateDishAsync }: UseDishModalProps): UseDishModalReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useActiveRestaurantId();
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [dishForm, setDishForm] = useState<DishFormValues>(INITIAL_DISH_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'characteristics' | 'ingredients' | 'modifiers' | 'media'>('general');
  const [modalSessionKey, setModalSessionKey] = useState<string>('init');

  const initialImageUrls = useMemo(() => {
    if (!editingDish) return [];
    if (editingDish.images && editingDish.images.length > 0) {
      return editingDish.images.map((img) => img.url);
    }
    return editingDish.imageUrl ? [editingDish.imageUrl] : [];
  }, [editingDish]);

  const gallery = useDishMediaGallery(initialImageUrls);
  const { data: modifierGroupsData = [] } = useModifierGroupsQuery();

  const modifierGroups = useMemo(() => {
    return modifierGroupsData.map((g) => ({ id: g.id, name: g.name, isRequired: g.isRequired, options: g.options }));
  }, [modifierGroupsData]);

  const handleOpenDishModal = (categoryId: string, dish?: Dish | null) => {
    setActiveCategoryId(categoryId);
    setFormErrors({});
    setActiveTab('general');
    setModalSessionKey(`dish-modal-${dish?.id || 'new'}-${Date.now()}`);

    if (dish) {
      setEditingDish(dish);
      setDishForm({
        name: dish.name,
        description: dish.description || '',
        price: dish.price,
        weight: dish.weight || null,
        cookingTime: dish.cookingTime || null,
        calories: dish.calories || null,
        badge: dish.badge || '',
        isAvailable: dish.isAvailable,
        isVegan: dish.isVegan,
        isSpicy: dish.isSpicy,
        isLactoseFree: dish.isLactoseFree,
        allergens: dish.allergens || [],
        tags: dish.tags || [],
        modifierIds: dish.modifierIds || [],
        ingredients: dish.ingredients || [],
      });
    } else {
      setEditingDish(null);
      setDishForm(INITIAL_DISH_FORM);
    }
    setIsDishModalOpen(true);
  };

  const [formState, formAction, isPending] = useAppActionState(
    async (formData) => {
      setFormErrors({});
      const name = (formData.get('name') as string || '').trim();
      const description = (formData.get('description') as string || '').trim();
      const weightRaw = formData.get('weight');
      const cookingTimeRaw = formData.get('cookingTime');
      const caloriesRaw = formData.get('calories');

      const currentFormPayload: DishFormValues = {
        ...dishForm,
        name,
        description: description || '',
        weight: weightRaw ? parseInt(weightRaw.toString(), 10) : null,
        cookingTime: cookingTimeRaw ? parseInt(cookingTimeRaw.toString(), 10) : null,
        calories: caloriesRaw ? parseInt(caloriesRaw.toString(), 10) : null,
      };

      const result = dishSchema.safeParse(currentFormPayload);
      if (!result.success) {
        const errorsMap = formatZodErrors(result.error, t);
        setFormErrors(errorsMap);
        throw new Error('Form validation failed');
      }

      let savedDishId = editingDish?.id || null;

      if (editingDish) {
        await updateDishAsync({ id: editingDish.id, data: currentFormPayload });
        toast.success(t('menu.constructor.dishes.notifications.updateSuccess'));
      } else {
        const createdDish = await createDishAsync({ categoryId: activeCategoryId, data: currentFormPayload });
        toast.success(t('menu.constructor.dishes.notifications.createSuccess'));
        savedDishId = createdDish.id;
      }

      if (gallery.dishPhotoFiles.length > 0 && savedDishId) {
        try {
          for (const file of gallery.dishPhotoFiles) {
            await menuApi.uploadDishPhoto(savedDishId, file);
          }
        } catch {
          toast.error(t('menu.constructor.dishes.notifications.imageUploadError'));
        }
      }

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
      gallery.clearGallery();
    },
    {
      t,
      onSuccess: () => setIsDishModalOpen(false),
    }
  );

  const errors = formState?.errors || {};
  const combinedErrors = { ...formErrors, ...errors };

  return {
    isDishModalOpen,
    setIsDishModalOpen,
    dishForm,
    setDishForm,
    formErrors: combinedErrors,
    editingDish,
    dishImageUrls: gallery.dishImageUrls,
    activeDishImageIndex: gallery.activeDishImageIndex,
    isSaving: isPending,
    activeTab,
    setActiveTab,
    handleLocalImageUploadWrapper: gallery.handleLocalImageUpload,
    handlePrevDishImage: gallery.handlePrevDishImage,
    handleNextDishImage: gallery.handleNextDishImage,
    handleSelectDishImage: gallery.handleSelectDishImage,
    handleOpenDishModal,
    formAction,
    handleRemoveImage: gallery.handleRemoveImage,
    handleSetAsMainImage: gallery.setAsMainImage,
    modifierGroups,
    modalSessionKey,
  };
};