'use client';

import { useState, useEffect, useRef } from 'react';
import { DragStartEvent, DragOverEvent, DragEndEvent, useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useMenu } from './useMenu';
import { useModifiersManagement } from '../modifiers/useModifiersManagement';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { Dish } from '../../types/dishes.types';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useCategoryModal } from '../categories/useCategoryModal';
import { useDishModal } from '../dishes/useDishModal';

export const useMenuBoard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const {
    categories,
    isLoading: isMenuLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createDishAsync,
    updateDish,
    updateDishAsync,
    deleteDish,
    reorderCategories,
    reorderDishes,
  } = useMenu();

  const { groups: modifierGroups, isLoading: isModifiersLoading } = useModifiersManagement();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'Category' | 'Dish' | null>(null);
  const [activeDishData, setActiveDishData] = useState<Dish | null>(null);
  const [dragSourceCategoryId, setDragSourceCategoryId] = useState<string | null>(null);
  const [dragTargetCategoryId, setDragTargetCategoryId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'dish'; id: string } | null>(null);

  const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryModal = useCategoryModal(createCategory, updateCategory);
  const dishModal = useDishModal({ createDishAsync, updateDishAsync });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    return () => {
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current);
      }
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);
    const type = active.data.current?.type;
    setActiveId(id);
    setActiveType(type);
    if (type === 'Dish') {
      const sourceCatId = active.data.current?.categoryId;
      setDragSourceCategoryId(sourceCatId);
      setDragTargetCategoryId(sourceCatId);
      const cat = categories.find((c: any) => c.id === sourceCatId);
      const dish = cat?.dishes?.find((d: any) => d.id === active.id);
      if (dish) setActiveDishData(dish);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !restaurantId) return;
    const currentActiveType = active.data.current?.type;
    const currentOverType = over.data.current?.type;
    if (currentActiveType === 'Dish') {
      const activeDishId = active.id;
      const currentSourceCatId = dragTargetCategoryId;
      let targetCatId = null;
      if (currentOverType === 'Category') targetCatId = String(over.id);
      else if (currentOverType === 'Dish') targetCatId = over.data.current?.categoryId;
      if (!targetCatId || currentSourceCatId === targetCatId) return;
      setDragTargetCategoryId(targetCatId);
      queryClient.setQueryData(['fullMenu', restaurantId], (old: any) => {
        if (!old || !old.categories) return old;
        let draggedDishObj: Dish | null = null;
        const updatedCategories = old.categories.map((cat: any) => {
          if (cat.id === currentSourceCatId) {
            draggedDishObj = cat.dishes.find((d: any) => d.id === activeDishId);
            return { ...cat, dishes: cat.dishes.filter((d: any) => d.id !== activeDishId) };
          }
          return cat;
        });
        if (!draggedDishObj) return old;
        return {
          ...old,
          categories: updatedCategories.map((cat: any) => {
            if (cat.id === targetCatId) {
              const currentDishes = cat.dishes || [];
              if (currentOverType === 'Dish') {
                const overIndex = currentDishes.findIndex((d: any) => d.id === over.id);
                const newDishes = [...currentDishes];
                newDishes.splice(overIndex >= 0 ? overIndex : 0, 0, draggedDishObj as Dish);
                return { ...cat, dishes: newDishes };
              }
              return { ...cat, dishes: [...currentDishes, draggedDishObj as Dish] };
            }
            return cat;
          }),
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentActiveType = activeType;
    setActiveId(null);
    setActiveType(null);
    if (!over || !restaurantId) {
      if (restaurantId) queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      setDragSourceCategoryId(null);
      setDragTargetCategoryId(null);
      setActiveDishData(null);
      return;
    }
    if (currentActiveType === 'Category') {
      const currentOverType = over.data.current?.type;
      if (currentOverType === 'Category' && active.id !== over.id) {
        const oldIndex = categories.findIndex((c: any) => c.id === active.id);
        const newIndex = categories.findIndex((c: any) => c.id === over.id);
        const newArray = arrayMove(categories, oldIndex, newIndex).map(
          (item: any, index: number) => ({ id: item.id, sortOrder: index }),
        );
        reorderCategories(newArray);
      }
    }
    if (currentActiveType === 'Dish') {
      if (dragSourceCategoryId && dragTargetCategoryId) {
        if (dragSourceCategoryId !== dragTargetCategoryId) {
          const targetCategory = categories.find((c: any) => c.id === dragTargetCategoryId);
          const targetDishes = targetCategory?.dishes ? [...targetCategory.dishes] : [];
          let insertIndex = targetDishes.length;
          if (over.data.current?.type === 'Dish') {
            const overIndex = targetDishes.findIndex((d: any) => d.id === over.id);
            if (overIndex !== -1) insertIndex = overIndex;
          }
          updateDish({
            id: String(active.id),
            data: { categoryId: dragTargetCategoryId, sortOrder: insertIndex },
          });
          if (activeDishData) {
            targetDishes.splice(insertIndex, 0, activeDishData);
            const newArray = targetDishes.map((item: any, index: number) => ({ id: item.id, sortOrder: index }));
            if (reorderTimeoutRef.current) clearTimeout(reorderTimeoutRef.current);
            reorderTimeoutRef.current = setTimeout(() => {
              reorderDishes(newArray);
            }, 50);
          }
        } else {
          const category = categories.find((c: any) => c.id === dragSourceCategoryId);
          if (category && active.id !== over.id) {
            const oldIndex = category.dishes.findIndex((d: any) => d.id === active.id);
            const newIndex = category.dishes.findIndex((d: any) => d.id === over.id);
            const newArray = arrayMove(category.dishes, oldIndex, newIndex).map(
              (item: any, index: number) => ({ id: item.id, sortOrder: index }),
            );
            reorderDishes(newArray);
          }
        }
      }
    }
    setDragSourceCategoryId(null);
    setDragTargetCategoryId(null);
    setActiveDishData(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') deleteCategory(deleteTarget.id);
    else deleteDish(deleteTarget.id);
    setDeleteTarget(null);
  };

  return {
    t,
    categories,
    isLoading: isMenuLoading || isModifiersLoading || restaurantId === null,
    modifierGroups,
    activeId,
    activeType,
    activeDishData,
    deleteTarget,
    setDeleteTarget,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleConfirmDelete,
    categoryModal,
    dishModal,
  };
};