'use client';

import { useMemo, useState, useCallback, createContext, useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { 
  useSensors, 
  useSensor, 
  PointerSensor, 
  KeyboardSensor,
  DndContext
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMenu } from '@/features/menu-builder/hooks/board/useMenu';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { usePermissions } from '@/shared/hooks/usePermissions';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { ReorderItem, FullCategory } from '@/features/menu-builder/types/menu-board.types';

interface MenuDndContextType {
  activeId: string | null;
  activeType: 'Category' | 'Dish' | null;
  activeDishData: Dish | null;
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const MenuDndContext = createContext<MenuDndContextType | undefined>(undefined);

export const MenuDndProvider = ({ children }: { children: ReactNode }) => {
  const restaurantId = useActiveRestaurantId();
  const { categories, updateDish, reorderCategories, reorderDishes } = useMenu();
  const { canEditMenu } = usePermissions();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'Category' | 'Dish' | null>(null);
  const [activeDishData, setActiveDishData] = useState<Dish | null>(null);
  
  const dragSourceCategoryIdRef = useRef<string | null>(null);
  const dragTargetCategoryIdRef = useRef<string | null>(null);
  
  const activationConstraint = useMemo(() => ({ distance: 8 }), []);
  
  const pointerSensor = useSensor(PointerSensor, { activationConstraint });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);
    const type = active.data?.current?.type as 'Category' | 'Dish' | undefined;
    
    setActiveId(id);
    setActiveType(type || null);

    if (type === 'Dish') {
      const sourceCatId = active.data?.current?.categoryId as string | undefined;
      if (sourceCatId) {
        const strSourceCatId = String(sourceCatId);
        dragSourceCategoryIdRef.current = strSourceCatId;
        dragTargetCategoryIdRef.current = strSourceCatId;
        const cat = categories.find((c: FullCategory) => String(c.id) === strSourceCatId);
        const dish = cat?.dishes?.find((d: Dish) => String(d.id) === id);
        if (dish) setActiveDishData(dish);
      }
    }
  }, [categories]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !restaurantId) return;

    const currentActiveType = active.data?.current?.type;
    const currentOverType = over.data?.current?.type;

    if (currentActiveType === 'Dish') {
      let targetCatId: string | null = null;
      if (currentOverType === 'Category') {
        targetCatId = String(over.id);
      } else if (currentOverType === 'Dish') {
        targetCatId = over.data?.current?.categoryId as string || null;
      }

      if (!targetCatId || dragTargetCategoryIdRef.current === targetCatId) return;
      dragTargetCategoryIdRef.current = targetCatId;
    }
  }, [restaurantId]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveType(null);
    
    if (!over || !restaurantId) {
      dragSourceCategoryIdRef.current = null;
      dragTargetCategoryIdRef.current = null;
      setActiveDishData(null);
      return;
    }

    const currentActiveType = active.data?.current?.type;
    
    if (currentActiveType === 'Category' && over.data?.current?.type === 'Category' && active.id !== over.id) {
      const oldIndex = categories.findIndex((c: FullCategory) => String(c.id) === String(active.id));
      const newIndex = categories.findIndex((c: FullCategory) => String(c.id) === String(over.id));
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newArray = arrayMove(categories, oldIndex, newIndex).map(
          (item, index): ReorderItem => ({ id: item.id, sortOrder: index }),
        );
        reorderCategories(newArray);
      }
    }
    
    if (currentActiveType === 'Dish' && dragSourceCategoryIdRef.current && dragTargetCategoryIdRef.current) {
      const strActiveId = String(active.id);
      if (dragSourceCategoryIdRef.current !== dragTargetCategoryIdRef.current) {
        const targetCategory = categories.find((c: FullCategory) => String(c.id) === dragTargetCategoryIdRef.current);
        const strOverId = String(over.id);
        const overIndex = targetCategory?.dishes 
          ? targetCategory.dishes.findIndex((d: Dish) => String(d.id) === strOverId) 
          : 0;
        const insertIndex = overIndex === -1 ? (targetCategory?.dishes?.length || 0) : overIndex;
        updateDish({
          id: strActiveId,
          data: { categoryId: dragTargetCategoryIdRef.current, sortOrder: insertIndex },
        });
      } else {
        const strOverId = String(over.id);
        const category = categories.find((c: FullCategory) => String(c.id) === dragSourceCategoryIdRef.current);
        if (category && active.id !== over.id) {
          const oldIndex = category.dishes.findIndex((d: Dish) => String(d.id) === strActiveId);
          let newIndex = category.dishes.findIndex((d: Dish) => String(d.id) === strOverId);
          
          if (newIndex === -1 && strOverId === dragSourceCategoryIdRef.current) {
            newIndex = 0;
          }
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const newArray = arrayMove(category.dishes, oldIndex, newIndex).map(
              (item, index): ReorderItem => ({ id: item.id, sortOrder: index }),
            );
            reorderDishes(newArray);
          }
        }
      }
    }
    
    dragSourceCategoryIdRef.current = null;
    dragTargetCategoryIdRef.current = null;
    setActiveDishData(null);
  }, [categories, restaurantId, reorderCategories, updateDish, reorderDishes]);

  const contextValue = useMemo(() => ({
    activeId,
    activeType,
    activeDishData,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  }), [activeId, activeType, activeDishData, sensors, handleDragStart, handleDragOver, handleDragEnd]);

  return (
    <MenuDndContext.Provider value={contextValue}>
      <DndContext sensors={canEditMenu ? sensors : []} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        {children}
      </DndContext>
    </MenuDndContext.Provider>
  );
};

export const useMenuDnd = () => {
  const context = useContext(MenuDndContext);
  if (!context) throw new Error('useMenuDnd must be used within a MenuDndProvider');
  return context;
};