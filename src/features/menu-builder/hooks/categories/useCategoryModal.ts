'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { categorySchema } from '../../schemas/categories.schema';
import toast from 'react-hot-toast';

export const useCategoryModal = (createCategory: any, updateCategory: any) => {
  const { t } = useTranslation();
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isCatModalOpen) {
      setError(null);
    }
  }, [isCatModalOpen]);

  const handleOpenCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.name);
    } else {
      setEditingCategory(null);
      setCatName('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = () => {
    const result = categorySchema.safeParse({ name: catName });
    if (!result.success) {
      setError(t(result.error.issues[0].message));
      return;
    }

    setError(null);

    const mutationOptions = {
      onSuccess: () => {
        setIsCatModalOpen(false);
        toast.success(t('common.success') || 'Категорію успішно збережено');
      },
      onError: (err: any) => {
        const apiError = err?.response?.data?.message || t('auth.errors.defaultError');
        setError(apiError);
        toast.error(apiError);
      }
    };

    if (editingCategory) {
      updateCategory({ id: editingCategory.id, name: catName }, mutationOptions);
    } else {
      createCategory(catName, mutationOptions);
    }
  };

  return {
    t,
    isCatModalOpen,
    setIsCatModalOpen,
    editingCategory,
    catName,
    setCatName,
    error,
    setError,
    handleOpenCategoryModal,
    handleSaveCategory,
  };
};