'use client';

import { useState } from 'react';
import { useMenu } from '@/features/menu-builder/hooks/board/useMenu';
import { useModifiersManagement } from '@/features/menu-builder/hooks/modifiers/useModifiersManagement';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useCategoryModal } from '@/features/menu-builder/hooks/categories/useCategoryModal';
import { useDishModal } from '@/features/menu-builder/hooks/dishes/useDishModal';

export const useMenuBoard = () => {
  const { t } = useTranslation();
  const restaurantId = useActiveRestaurantId();
  const {
    categories,
    isLoading: isMenuLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createDishAsync,
    updateDishAsync,
    deleteDish,
  } = useMenu();
  const { groups: modifierGroups, isLoading: isModifiersLoading } = useModifiersManagement();
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'dish'; id: string } | null>(null);

  const categoryModal = useCategoryModal(createCategory, updateCategory);
  const dishModal = useDishModal({ createDishAsync, updateDishAsync });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      deleteCategory(deleteTarget.id);
    } else {
      deleteDish(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return {
    t,
    categories,
    isLoading: isMenuLoading || isModifiersLoading || restaurantId === null,
    modifierGroups,
    deleteTarget,
    setDeleteTarget,
    handleConfirmDelete,
    categoryModal,
    dishModal,
  };
};