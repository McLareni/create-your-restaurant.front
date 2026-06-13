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
        className="w-full h-32 rounded-2xl bg-zinc-100 dark:bg-brand-gray/5 border border-dashed border-zinc-300 dark:border-brand-gray/20 opacity-30"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full bg-white/60 dark:bg-brand-mocha/20 rounded-2xl border border-zinc-100 dark:border-brand-gray/10 py-4 shadow-xs"
    >
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-zinc-100 dark:border-brand-gray/10 group px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-zinc-400 hover:text-brand-copper cursor-grab active:cursor-grabbing transition-colors shrink-0"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 min-w-0 cursor-pointer select-none flex-1 py-1 rounded-lg hover:bg-brand-cream/20 dark:hover:bg-brand-gray/5 transition-colors px-1"
          >
            <div className="text-zinc-400 dark:text-brand-cream/60 shrink-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm font-bold text-brand-espresso dark:text-brand-cream truncate">
                {category.name}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-100 dark:bg-brand-gray/20 text-zinc-500 dark:text-brand-cream/60 rounded-full shrink-0">
                {categoryDishes.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
          <button
            type="button"
            onClick={() => onAddDish(category.id)}
            className="p-1.5 rounded-lg text-brand-copper hover:bg-brand-copper/10 transition-colors cursor-pointer"
            title={t('menu.constructor.dishes.addBtn')}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-brand-gray/20 transition-colors cursor-pointer"
            title={t('menu.constructor.categories.editBtn')}
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory({ type: 'category', id: category.id })}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t('menu.constructor.categories.deleteBtn')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 h-0 overflow-hidden'}`}>
        <div className="overflow-hidden">
          <SortableContext items={categoryDishes.map((d) => d.id)} strategy={rectSortingStrategy}>
            {/* ВИПРАВЛЕНО НАКЛАДАННЯ (Пакет "Perfect Flex Alignment"):
              Замінено grid на flex flex-wrap. Тепер плейсхолдер і картки поводяться синхронно,
              ідеально стають в ряди на 2K екрані та м'яко штовхають сусідні елементи без налізань.
            */}
            <div className="flex flex-wrap gap-4 min-h-16 rounded-xl custom-sortable-dropzone pt-1 justify-start items-start px-4">
              {categoryDishes.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-8 text-center border border-dashed border-zinc-200 dark:border-dashed dark:border-brand-gray/20 rounded-xl bg-zinc-50/30 dark:bg-brand-mocha/5">
                  <FolderOpen className="h-5 w-5 text-zinc-300 dark:text-brand-gray/30 mb-1" />
                  <p className="text-[11px] text-zinc-400 dark:text-brand-cream/40">
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