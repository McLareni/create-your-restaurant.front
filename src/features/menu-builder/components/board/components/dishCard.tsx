'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { DishCardVisual } from '@/shared/ui/dishCardVisual';
import type { Dish } from '@/features/menu-builder/types/dishes.types';

interface DishCardProps {
  dish: Dish;
  categoryId: string;
  onEdit: (categoryId: string, dish: Dish) => void;
  onDelete: (target: { type: 'dish'; id: string }) => void;
  onView: (dish: Dish) => void;
  isOverlay?: boolean;
  isLiveDnd?: boolean;
}

export const DishCard = ({ 
  dish, 
  categoryId, 
  onEdit, 
  onDelete, 
  onView,
  isOverlay = false, 
  isLiveDnd = false 
}: DishCardProps) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dish.id,
    data: {
      type: 'Dish',
      dish,
      categoryId,
    },
    disabled: isLiveDnd,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isLiveDnd ? undefined : transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-60 h-64 rounded-md bg-bg-element/50 border border-dashed border-border-main/60 opacity-40 shrink-0"
      />
    );
  }

  return (
    <DishCardVisual
      ref={setNodeRef}
      style={style}
      name={dish.name}
      description={dish.description}
      price={dish.price}
      weight={dish.weight}
      calories={dish.calories}
      cookingTime={dish.cookingTime}
      badge={dish.badge}
      isAvailable={dish.isAvailable}
      imageUrl={dish.images && dish.images.length > 0 ? dish.images[0].url : (dish.imageUrl || null)}
      onClick={() => onView(dish)}
      className={
        isOverlay 
          ? 'ring-1 ring-emerald-500/30 border-brand-emerald/50 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] scale-[1.02]' 
          : ''
      }
      topLeftAction={
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 p-1.5 bg-bg-surface/90 backdrop-blur-xs rounded-md text-text-muted hover:text-brand-emerald cursor-grab active:cursor-grabbing transition-colors shadow-2xs z-10 border border-border-main/40"
          title={t('menu.constructor.dishes.title')}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      }
      topRightActions={
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-20 bg-bg-surface/90 backdrop-blur-xs p-0.5 rounded-lg shadow-sm border border-border-main/40">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(categoryId, dish);
            }}
            className="p-1.5 rounded-md text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors cursor-pointer border-0 bg-transparent outline-none"
            title={t('menu.constructor.dishes.editBtn')}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete({ type: 'dish', id: dish.id });
            }}
            className="p-1.5 rounded-md text-text-muted hover:text-red-500 hover:bg-red-50/5 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            title={t('menu.constructor.dishes.deleteBtn')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    />
  );
};