'use client';

import { useState, ChangeEvent } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { dishSchema, INITIAL_DISH_FORM } from '@/features/menu-builder/schemas/dishes.schema';
import { modifiersApi } from '@/features/menu-builder/api/modifiers.api';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import type { Dish, UseDishModalProps, ModifierGroupLookup, UseDishModalReturn } from '@/features/menu-builder/types/dishes.types';
import type { ModifierGroup } from '@/features/menu-builder/types/modifiers.types';
import toast from 'react-hot-toast';

export const useDishModal = ({ createDishAsync, updateDishAsync }: UseDishModalProps): UseDishModalReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [dishForm, setDishForm] = useState<DishFormValues>(INITIAL_DISH_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dishPhotoFiles, setDishPhotoFiles] = useState<File[]>([]);
  const [dishImageUrls, setDishImageUrls] = useState<string[]>([]);
  const [activeDishImageIndex, setActiveDishImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'characteristics' | 'ingredients' | 'modifiers' | 'media'>('general');

  const { data: groups = [] } = useQuery<ModifierGroup[]>({
    queryKey: ['modifierGroups', restaurantId],
    queryFn: () => modifiersApi.getGroups(restaurantId!),
    enabled: !!restaurantId,
  });

  const modifierGroups: ModifierGroupLookup[] = groups.map((g) => ({
    id: g.id,
    name: g.name,
  }));

  const revokeLocalUrls = (urls: string[]): void => {
    urls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setDishPhotoFiles((prev) => [...prev, ...files]);
    setDishImageUrls((prev) => [...prev, ...previewUrls]);
    setActiveDishImageIndex(dishImageUrls.length);
    e.target.value = '';
  };

  const handleLocalImageUploadWrapper = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      toast.loading(t('menu.constructor.dishes.notifications.imageUploading'), { id: 'img-upload' });
      await handleImageUpload(e);
      toast.success(t('menu.constructor.dishes.notifications.imageUploadSuccess'), { id: 'img-upload' });
    } catch {
      toast.error(t('menu.constructor.dishes.notifications.imageUploadError'), { id: 'img-upload' });
    }
  };

  const handlePrevDishImage = (): void => {
    if (dishImageUrls.length === 0) return;
    setActiveDishImageIndex((prev) => (prev === 0 ? dishImageUrls.length - 1 : prev - 1));
  };

  const handleNextDishImage = (): void => {
    if (dishImageUrls.length === 0) return;
    setActiveDishImageIndex((prev) => (prev === dishImageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleSelectDishImage = (index: number): void => {
    setActiveDishImageIndex(index);
  };

  const handleOpenDishModal = (categoryId: string, dish?: Dish | null) => {
    revokeLocalUrls(dishImageUrls);
    setActiveCategoryId(categoryId);
    setFormErrors({});
    setDishPhotoFiles([]);
    setIsSaving(false);
    setActiveTab('general');
    if (dish) {
      setEditingDish(dish);
      const existingImageUrls = dish.images?.map((image) => image.url) || (dish.imageUrl ? [dish.imageUrl] : []);
      setDishImageUrls(existingImageUrls);
      setActiveDishImageIndex(0);
      setDishForm({
        name: dish.name,
        description: dish.description || '',
        price: dish.price,
        weight: dish.weight ?? null,
        cookingTime: dish.cookingTime ?? null,
        calories: dish.calories ?? null,
        isVegan: dish.isVegan ?? false,
        isSpicy: dish.isSpicy ?? false,
        isLactoseFree: dish.isLactoseFree ?? false,
        badge: dish.badge || 'NONE',
        allergens: dish.allergens || [],
        tags: dish.tags || [],
        modifierIds: dish.modifierIds || [],
        isAvailable: dish.isAvailable ?? true,
        ingredients: dish.ingredients || [],
      });
    } else {
      setEditingDish(null);
      setDishImageUrls([]);
      setActiveDishImageIndex(0);
      setDishForm(INITIAL_DISH_FORM);
    }
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (): Promise<void> => {
    if (isSaving || !restaurantId) return;
    setFormErrors({});
    const validation = dishSchema.safeParse(dishForm);
    if (!validation.success) {
      const errorsMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errorsMap[path] = issue.message;
      });
      setFormErrors(errorsMap);
      toast.error(t(validation.error.issues[0].message) || t('errors.formValidation'));
      return;
    }

    setIsSaving(true);
    try {
      let savedDishId = editingDish?.id;
      if (editingDish) {
        await updateDishAsync({ id: editingDish.id, data: validation.data });
      } else {
        const createdDish = await createDishAsync({
          categoryId: activeCategoryId,
          data: validation.data,
        });
        savedDishId = createdDish?.id;
      }

      if (dishPhotoFiles.length > 0 && savedDishId) {
        for (const file of dishPhotoFiles) {
          await menuApi.uploadDishPhoto(savedDishId, file);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      await queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });

      revokeLocalUrls(dishImageUrls);
      setDishPhotoFiles([]);
      setDishImageUrls([]);
      setActiveDishImageIndex(0);
      setIsDishModalOpen(false);
    } catch {
      toast.error(t('errors.unknown'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isDishModalOpen,
    setIsDishModalOpen: (open: boolean) => {
      if (!open) revokeLocalUrls(dishImageUrls);
      setIsDishModalOpen(open);
    },
    dishForm,
    setDishForm,
    formErrors,
    editingDish,
    dishImageUrls,
    activeDishImageIndex,
    isSaving,
    activeTab,
    setActiveTab,
    handleLocalImageUploadWrapper,
    handlePrevDishImage,
    handleNextDishImage,
    handleSelectDishImage,
    handleOpenDishModal,
    handleSaveDish,
    modifierGroups,
  };
};