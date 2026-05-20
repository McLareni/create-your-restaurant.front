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
import { useMenu } from './useMenu';
import { useModifiers } from './useModifiers';
import { useUserStore } from '@/shared/store/useUserStore';
import { dishSchema, DishFormValues } from '../schemas/dishes.schema';
import { Dish } from '../types/dishes.types';

const INITIAL_DISH_FORM: DishFormValues = {
  name: '',
  description: '',
  price: 0,
  variants: [],
  taxRate: 20,
  weight: '',
  cookingTime: '',
  calories: '',
  badge: 'NONE',
  allergens: [],
  tags: [],
  modifierIds: [],
  isAvailable: true,
  ingredients: [],
  upsellDishIds: []
};

export const useMenuBoard = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const {
    categories,
    isLoading: isMenuLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createDish,
    updateDish,
    deleteDish,
    reorderCategories,
    reorderDishes
  } = useMenu();

  const { groups: modifierGroups, isLoading: isModifiersLoading } = useModifiers();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'Category' | 'Dish' | null>(null);
  const [activeDishData, setActiveDishData] = useState<Dish | null>(null);
  const [dragSourceCategoryId, setDragSourceCategoryId] = useState<string | null>(null);
  const [dragTargetCategoryId, setDragTargetCategoryId] = useState<string | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState('');

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [dishForm, setDishForm] = useState<DishFormValues>(INITIAL_DISH_FORM);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'dish'; id: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

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
    if (!over) return;

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
          })
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentActiveType = activeType;

    setActiveId(null);
    setActiveType(null);

    if (!over) {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
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
          (item: any, index: number) => ({ id: item.id, sortOrder: index })
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
            data: {
              categoryId: dragTargetCategoryId,
              sortOrder: insertIndex
            }
          });

          if (activeDishData) {
            targetDishes.splice(insertIndex, 0, activeDishData);
            const newArray = targetDishes.map((item: any, index: number) => ({ id: item.id, sortOrder: index }));
            setTimeout(() => reorderDishes(newArray), 50);
          }
        } else {
          const category = categories.find((c: any) => c.id === dragSourceCategoryId);
          if (category && active.id !== over.id) {
            const oldIndex = category.dishes.findIndex((d: any) => d.id === active.id);
            const newIndex = category.dishes.findIndex((d: any) => d.id === over.id);

            const newArray = arrayMove(category.dishes, oldIndex, newIndex).map(
              (item: any, index: number) => ({ id: item.id, sortOrder: index })
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {};

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
    if (!catName.trim()) return;
    if (editingCategory) updateCategory({ id: editingCategory.id, name: catName });
    else createCategory(catName);
    setIsCatModalOpen(false);
  };

  const handleOpenDishModal = (categoryId: string, dish?: Dish) => {
    setActiveCategoryId(categoryId);
    if (dish) {
      setEditingDish(dish);
      setDishForm({
        name: dish.name,
        description: dish.description || '',
        price: dish.price,
        variants: dish.variants || [],
        taxRate: dish.taxRate || 20,
        weight: dish.weight || '',
        cookingTime: dish.cookingTime || '',
        calories: dish.calories || '',
        badge: dish.badge || 'NONE',
        allergens: dish.allergens || [],
        tags: dish.tags || [],
        modifierIds: dish.modifierIds || [],
        isAvailable: dish.isAvailable ?? true,
        ingredients: dish.ingredients || [],
        upsellDishIds: dish.upsellDishIds || []
      });
    } else {
      setEditingDish(null);
      setDishForm(INITIAL_DISH_FORM);
    }
    setIsDishModalOpen(true);
  };

  const handleSaveDish = () => {
    const validation = dishSchema.safeParse(dishForm);
    if (!validation.success) return;

    if (editingDish) {
      updateDish({ id: editingDish.id, data: validation.data });
    } else {
      createDish({ categoryId: activeCategoryId, data: validation.data });
    }
    setIsDishModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') deleteCategory(deleteTarget.id);
    else deleteDish(deleteTarget.id);
    setDeleteTarget(null);
  };

  return {
    categories,
    isMenuLoading,
    modifierGroups,
    isModifiersLoading,
    activeId,
    activeType,
    activeDishData,
    isCatModalOpen,
    setIsCatModalOpen,
    catName,
    setCatName,
    editingCategory,
    isDishModalOpen,
    setIsDishModalOpen,
    dishForm,
    setDishForm,
    editingDish,
    deleteTarget,
    setDeleteTarget,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleImageUpload,
    handleOpenCategoryModal,
    handleSaveCategory,
    handleOpenDishModal,
    handleSaveDish,
    handleConfirmDelete,
  };
};