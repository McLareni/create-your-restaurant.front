'use client';

import { useState } from 'react';
import { 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent, 
  useSensors, 
  useSensor, 
  PointerSensor, 
  KeyboardSensor 
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useMenu } from '@/features/menu-builder/hooks/board/useMenu';
import { useModifiersManagement } from '@/features/menu-builder/hooks/modifiers/useModifiersManagement';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useCategoryModal } from '@/features/menu-builder/hooks/categories/useCategoryModal';
import { useDishModal } from '@/features/menu-builder/hooks/dishes/useDishModal';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { ReorderItem, FullCategory, FullMenuResponse } from '@/features/menu-builder/types/menu-board.types';

export const useMenuBoard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null);
  
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

  const categoryModal = useCategoryModal(createCategory, updateCategory);
  const dishModal = useDishModal({ createDishAsync, updateDishAsync });
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);
    const type = active.data.current?.type as 'Category' | 'Dish' | undefined;
    setActiveId(id);
    setActiveType(type || null);
    
    if (type === 'Dish') {
      const sourceCatId = active.data.current?.categoryId as string | undefined;
      if (sourceCatId) {
        const strSourceCatId = String(sourceCatId);
        setDragSourceCategoryId(strSourceCatId);
        setDragTargetCategoryId(strSourceCatId);
        const cat = categories.find((c: FullCategory) => String(c.id) === strSourceCatId);
        const dish = cat?.dishes?.find((d: Dish) => String(d.id) === id);
        if (dish) setActiveDishData(dish);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !restaurantId) return;
    const currentActiveType = active.data.current?.type;
    const currentOverType = over.data.current?.type;
    
    if (currentActiveType === 'Dish') {
      const activeDishId = String(active.id);
      const currentSourceCatId = dragTargetCategoryId;
      let targetCatId: string | null = null;
      
      if (currentOverType === 'Category') targetCatId = String(over.id);
      else if (currentOverType === 'Dish') targetCatId = over.data.current?.categoryId as string || null;
      
      if (!targetCatId || currentSourceCatId === String(targetCatId)) return;
      
      const strTargetCatId = String(targetCatId);
      setDragTargetCategoryId(strTargetCatId);
      
      queryClient.setQueryData<FullMenuResponse>(['fullMenu', restaurantId], (old) => {
        if (!old || !old.categories) return old;
        let draggedDishObj: Dish | null = null;
        
        const updatedCategories = old.categories.map((cat: FullCategory): FullCategory => {
          if (String(cat.id) === currentSourceCatId) {
            draggedDishObj = cat.dishes.find((d: Dish) => String(d.id) === activeDishId) || null;
            return { ...cat, dishes: cat.dishes.filter((d: Dish) => String(d.id) !== activeDishId) };
          }
          return cat;
        });
        
        if (!draggedDishObj) return old;
        
        return {
          ...old,
          categories: updatedCategories.map((cat: FullCategory): FullCategory => {
            if (String(cat.id) === strTargetCatId) {
              const currentDishes = cat.dishes || [];
              if (currentOverType === 'Dish') {
                const overIndex = currentDishes.findIndex((d: Dish) => String(d.id) === String(over.id));
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
      if (restaurantId) void queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      setDragSourceCategoryId(null);
      setDragTargetCategoryId(null);
      setActiveDishData(null);
      return;
    }
    
    if (currentActiveType === 'Category') {
      const currentOverType = over.data.current?.type;
      if (currentOverType === 'Category' && active.id !== over.id) {
        const oldIndex = categories.findIndex((c: FullCategory) => String(c.id) === String(active.id));
        const newIndex = categories.findIndex((c: FullCategory) => String(c.id) === String(over.id));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newArray = arrayMove(categories, oldIndex, newIndex).map(
            (item, index): ReorderItem => ({ id: item.id, sortOrder: index }),
          );
          reorderCategories(newArray);
        }
      }
    }
    
    if (currentActiveType === 'Dish') {
      if (dragSourceCategoryId && dragTargetCategoryId) {
        const strActiveId = String(active.id);
        const strOverId = String(over.id);
        
        if (dragSourceCategoryId !== dragTargetCategoryId) {
          const targetCategory = categories.find((c: FullCategory) => String(c.id) === dragTargetCategoryId);
          const targetDishes = targetCategory?.dishes ? [...targetCategory.dishes] : [];
          let insertIndex = targetDishes.length;
          
          if (over.data.current?.type === 'Dish') {
            const overIndex = targetDishes.findIndex((d: Dish) => String(d.id) === strOverId);
            if (overIndex !== -1) insertIndex = overIndex;
          }
          
          updateDish({
            id: strActiveId,
            data: { categoryId: dragTargetCategoryId, sortOrder: insertIndex },
          });
        } else {
          const category = categories.find((c: FullCategory) => String(c.id) === dragSourceCategoryId);
          if (category && active.id !== over.id) {
            const oldIndex = category.dishes.findIndex((d: Dish) => String(d.id) === strActiveId);
            const newIndex = category.dishes.findIndex((d: Dish) => String(d.id) === strOverId);
            
            if (oldIndex !== -1 && newIndex !== -1) {
              const newArray = arrayMove(category.dishes, oldIndex, newIndex).map(
                (item, index): ReorderItem => ({ id: item.id, sortOrder: index }),
              );
              reorderDishes(newArray);
            }
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