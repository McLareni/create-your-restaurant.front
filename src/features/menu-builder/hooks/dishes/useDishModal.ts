'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { dishSchema, DishFormValues, INITIAL_DISH_FORM } from '../../schemas/dishes.schema';
import { Dish } from '../../types/dishes.types';
import { menuApi } from '../../api/menu.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useDishModal = (
  createDishAsync: any,
  updateDishAsync: any,
  queryClient: any,
  t: any
) => {
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [dishForm, setDishForm] = useState<DishFormValues>(INITIAL_DISH_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dishPhotoFiles, setDishPhotoFiles] = useState<File[]>([]);
  const [dishImageUrls, setDishImageUrls] = useState<string[]>([]);
  const [activeDishImageIndex, setActiveDishImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'characteristics' | 'ingredients' | 'modifiers' | 'upsell' | 'media'>('general');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const tiffFiles = files.filter((file) => {
      const fileName = file.name.toLowerCase();
      const mimeType = file.type.toLowerCase();
      return (
        fileName.endsWith('.tif') ||
        fileName.endsWith('.tiff') ||
        mimeType === 'image/tif' ||
        mimeType === 'image/tiff'
      );
    });

    const validFiles = files.filter((file) => !tiffFiles.includes(file));

    if (tiffFiles.length > 0) {
      toast.error(t('menu.constructor.dishes.modal.errors.tiffNotSupported'));
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setDishPhotoFiles((prev) => [...prev, ...validFiles]);
    setDishImageUrls((prev) => [...prev, ...previewUrls]);
    setActiveDishImageIndex(dishImageUrls.length);
    e.target.value = '';
  };

  const handleLocalImageUploadWrapper = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePrevDishImage = () => {
    if (dishImageUrls.length === 0) return;
    setActiveDishImageIndex((prev) => (prev === 0 ? dishImageUrls.length - 1 : prev - 1));
  };

  const handleNextDishImage = () => {
    if (dishImageUrls.length === 0) return;
    setActiveDishImageIndex((prev) => (prev === dishImageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleSelectDishImage = (index: number) => {
    setActiveDishImageIndex(index);
  };

  const handleAddVariant = () => {
    const currentVariants = dishForm.variants || [];
    setDishForm({ ...dishForm, variants: [...currentVariants, { name: '', price: 0, sku: '' }] });
  };

  const handleRemoveVariant = (index: number) => {
    const currentVariants = [...(dishForm.variants || [])];
    currentVariants.splice(index, 1);
    setDishForm({ ...dishForm, variants: currentVariants });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const currentVariants = [...(dishForm.variants || [])];
    currentVariants[index] = { ...currentVariants[index], [field]: value };
    setDishForm({ ...dishForm, variants: currentVariants });
  };

  const handleOpenDishModal = (categoryId: string, dish?: Dish) => {
    dishImageUrls.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
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
        variants: dish.variants || [],
        taxRate: dish.taxRate || 20,
        weight: dish.weight,
        cookingTime: dish.cookingTime,
        calories: dish.calories,
        isVegan: dish.isVegan ?? false,
        isSpicy: dish.isSpicy ?? false,
        isLactoseFree: dish.isLactoseFree ?? false,
        badge: dish.badge || 'NONE',
        allergens: dish.allergens || [],
        tags: dish.tags || [],
        modifierIds: dish.modifierIds || [],
        isAvailable: dish.isAvailable ?? true,
        ingredients: dish.ingredients || [],
        upsellDishIds: dish.upsellDishIds || [],
      });
    } else {
      setEditingDish(null);
      setDishImageUrls([]);
      setActiveDishImageIndex(0);
      setDishForm(INITIAL_DISH_FORM);
    }
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async () => {
    if (isSaving) return;
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
        await Promise.all(dishPhotoFiles.map((file) => menuApi.uploadDishPhoto(savedDishId, file)));
      }

      await queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      await queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      await queryClient.invalidateQueries({ queryKey: ['dishes-lookup', restaurantId] });

      dishImageUrls.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });

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

  const handleCloseDishModal = () => {
    dishImageUrls.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    setDishPhotoFiles([]);
    setDishImageUrls([]);
    setActiveDishImageIndex(0);
    setIsSaving(false);
    setIsDishModalOpen(false);
  };

  return {
    isDishModalOpen,
    setIsDishModalOpen: (open: boolean) => {
      if (!open) handleCloseDishModal();
      else setIsDishModalOpen(true);
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
    handleAddVariant,
    handleRemoveVariant,
    handleVariantChange,
    handleOpenDishModal,
    handleSaveDish,
  };
};