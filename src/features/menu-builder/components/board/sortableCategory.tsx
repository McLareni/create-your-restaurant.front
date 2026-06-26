'use client';

import React, { useState } from 'react';
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Plus, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { DishCard } from '@/features/menu-builder/components/board/dishCard';
import type { SortableCategoryProps } from '@/features/menu-builder/types/categories.types';

export const SortableCategory = ({
  category,
  categoryDishes,
  onEditCategory,
  onDeleteCategory,
  onAddDish,
  onEditDish,
  onDeleteCategoryDish,
  t,
}: SortableCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      className="w-full bg-bg-surface rounded-md border border-solid border-neutral-300 dark:border-neutral-700 py-4 shadow-table overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-solid border-neutral-200 dark:border-neutral-800 group px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-text-muted/50 hover:text-brand-emerald cursor-grab active:cursor-grabbing transition-colors shrink-0"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 min-w-0 cursor-pointer select-none flex-1 py-1 rounded-lg hover:bg-bg-hover/30 transition-colors px-1"
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

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
          <button
            type="button"
            onClick={() => onAddDish(category.id)}
            className="p-1.5 rounded-lg text-brand-emerald hover:bg-brand-emerald/10 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            title={t('menu.constructor.dishes.addBtn')}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors cursor-pointer border-0 bg-transparent outline-none"
            title={t('menu.constructor.categories.editBtn')}
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory({ type: 'category', id: category.id })}
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50/5 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            title={t('menu.constructor.categories.deleteBtn')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden min-h-0">
          <SortableContext items={categoryDishes.map((d) => d.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-4 min-h-16 rounded-xl custom-sortable-dropzone pt-1 justify-start items-start px-4">
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