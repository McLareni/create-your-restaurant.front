'use client';

import { useState } from 'react';
import { categorySchema } from '@/features/menu-builder/schemas/categories.schema';
import type { CategoryData } from '@/features/menu-builder/types/categories.types';

export const useCategoryModal = (
  createCategory: (name: string) => void,
  updateCategory: (params: { id: string; name: string }) => void
) => {
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [catName, setCatName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenCategoryModal = (category?: CategoryData) => {
    setError(null);
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
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);

    if (editingCategory) {
      updateCategory({ id: editingCategory.id, name: catName });
    } else {
      createCategory(catName);
    }
    setIsCatModalOpen(false);
  };

  return {
    isCatModalOpen,
    setIsCatModalOpen,
    editingCategory,
    catName,
    setCatName,
    error,
    handleOpenCategoryModal,
    handleSaveCategory,
  };
};