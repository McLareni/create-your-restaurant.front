'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Plus, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { DishCard } from '@/features/menu-builder/components/board/components/dishCard';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { usePermissions } from '@/shared/hooks/usePermissions';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { FullCategory } from '@/features/menu-builder/types/menu-board.types';

interface CleanSortableCategoryProps {
  category: FullCategory;
  categoryDishes: Dish[];
  onEditCategory: (category: FullCategory) => void;
  onDeleteCategory: (target: { type: 'category'; id: string }) => void;
  onAddDish: (categoryId: string) => void;
  onEditDish: (categoryId: string, dish: Dish) => void;
  onDeleteCategoryDish: (target: { type: 'dish'; id: string }) => void;
  onViewDish: (dish: Dish) => void;
}

const emptySubscribe = () => () => {};

export const SortableCategory = ({
  category,
  categoryDishes,
  onEditCategory,
  onDeleteCategory,
  onAddDish,
  onEditDish,
  onDeleteCategoryDish,
  onViewDish,
}: CleanSortableCategoryProps) => {
  const { t } = useTranslation();
  const restaurantId = useActiveRestaurantId();
  const { canCreateMenu, canEditMenu, canDeleteMenu } = usePermissions();
  const storageKey = restaurantId ? `cat-expanded-${restaurantId}-${category.id}` : null;

  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [shouldRenderContent, setShouldRenderContent] = useState<boolean>(true);

  useEffect(() => {
    if (!storageKey) return;
    let isCancelled = false;

    Promise.resolve().then(() => {
      if (isCancelled) return;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          const parsedValue = saved === 'true';
          setIsExpanded(parsedValue);
          setShouldRenderContent(parsedValue);
        }
      } catch {}
    });

    return () => {
      isCancelled = true;
    };
  }, [storageKey]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      type: 'Category',
      category,
    },
    disabled: !canEditMenu,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      setShouldRenderContent(true);
    }
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, String(nextState));
      } catch {}
    }
  };

  const handleAnimationEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'grid-template-rows' && !isExpanded) {
      setShouldRenderContent(false);
    }
  };

  if (!isMounted) {
    return <div className="w-full h-16 rounded-md bg-bg-surface border border-solid border-neutral-300 dark:border-neutral-700 shadow-table animate-pulse mb-3" />;
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full h-32 rounded-md bg-bg-element/40 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-30"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full bg-bg-surface rounded-md border border-solid border-neutral-300 dark:border-neutral-700 shadow-table overflow-hidden transition-all"
    >
      <div
        className={`flex items-center justify-between gap-2 border-solid border-neutral-200 dark:border-neutral-800 group px-4 pt-3.5 pb-3.5 ${
          isExpanded ? 'border-b mb-3' : 'border-b-transparent mb-0'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {canEditMenu && (
            <div
              {...attributes}
              {...listeners}
              className="p-1 text-text-muted/50 hover:text-brand-emerald cursor-grab active:cursor-grabbing transition-colors shrink-0"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          )}

          <div
            onClick={handleToggleExpand}
            className="flex items-center gap-2 min-w-0 cursor-pointer select-none flex-1 py-1 rounded-lg transition-colors px-1"
          >
            <div className="text-text-muted/60 shrink-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm font-bold text-text-main truncate">
                {category.name}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-bg-element text-text-muted rounded-full shrink-0 font-mono">
                {categoryDishes.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 transition-opacity duration-150 shrink-0">
          {canCreateMenu && (
            <button
              type="button"
              onClick={() => onAddDish(category.id)}
              className="p-1.5 rounded-lg text-brand-emerald hover:bg-brand-emerald/10 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
          {canEditMenu && (
            <button
              type="button"
              onClick={() => onEditCategory(category)}
              className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
          )}
          {canDeleteMenu && (
            <button
              type="button"
              onClick={() => onDeleteCategory({ type: 'category', id: category.id })}
              className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50/5 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        onTransitionEnd={handleAnimationEnd}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out overflow-hidden ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden min-h-0" style={{ display: shouldRenderContent ? 'block' : 'none' }}>
          <SortableContext items={categoryDishes.map((d) => d.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-4 min-h-16 rounded-xl custom-sortable-dropzone pt-1 justify-start items-start px-4 pb-4">
              {categoryDishes.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-bg-main/30">
                  <FolderOpen className="h-5 w-5 text-text-muted/30 mb-1" />
                  <p className="text-[11px] text-text-muted font-light">
                    {t('menu.constructor.dishes.emptyTitle')}
                  </p>
                </div>
              ) : (
                categoryDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    categoryId={category.id}
                    onEdit={onEditDish}
                    onDelete={onDeleteCategoryDish}
                    onView={onViewDish}
                    canEdit={canEditMenu}
                    canDelete={canDeleteMenu}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
};