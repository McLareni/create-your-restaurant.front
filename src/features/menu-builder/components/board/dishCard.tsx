'use client';

import React from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical, EyeOff } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { Dish } from '@/features/menu-builder/types/dishes.types';

interface DishCardProps {
  dish: Dish;
  categoryId: string;
  onEdit: (categoryId: string, dish: Dish) => void;
  onDelete: (target: { type: 'dish'; id: string }) => void;
  isOverlay?: boolean;
}

export const DishCard = ({ dish, categoryId, onEdit, onDelete, isOverlay = false }: DishCardProps) => {
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-60 h-56 rounded-md bg-bg-element/50 border border-dashed border-border-main/60 opacity-40 shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col w-60 h-56 bg-bg-surface border rounded-md transition-all duration-200 overflow-hidden shrink-0 ${
        !dish.isAvailable ? 'opacity-70 bg-bg-main/40' : 'border-border-main/60 dark:border-border-main hover:border-brand-emerald/40 hover:shadow-md'
      } ${
        isOverlay 
          ? 'ring-1 ring-emerald-500/30 border-brand-emerald/50 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] scale-[1.02] bg-bg-surface' 
          : 'shadow-table'
      }`}
    >
      <div className="relative w-full h-28 bg-bg-main/60 shrink-0 border-b border-solid border-border-main/40">
        {dish.images && dish.images.length > 0 ? (
          <Image
            src={dish.images[0].url}
            alt={dish.name}
            fill
            sizes="240px"
            className="object-cover group-hover:scale-103 transition-transform duration-300 pointer-events-none select-none"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted/60 text-center font-medium p-2 leading-tight bg-bg-element/30">
            {t('menu.public.noPhoto')}
          </div>
        )}

        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="bg-neutral-900/90 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium shadow-sm">
              <EyeOff className="h-3 w-3" /> {t('inventory.statusStopped')}
            </div>
          </div>
        )}

        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-bg-surface/90 backdrop-blur-xs rounded-md text-text-muted hover:text-brand-emerald cursor-grab active:cursor-grabbing transition-colors shadow-2xs z-10 border border-border-main/40"
          title={t('menu.constructor.dishes.title')}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {dish.badge && dish.badge !== 'NONE' && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="text-[8px] px-1.5 py-0.5 font-extrabold rounded-md uppercase bg-brand-emerald text-white tracking-wider shadow-2xs">
              {t(`menu.constructor.badges.${dish.badge}`)}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0 bg-bg-surface">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-text-main truncate mb-0.5">
            {dish.name}
          </h4>
          <p className="text-[10px] text-text-muted font-light line-clamp-2 leading-tight">
            {dish.description || t('menu.public.noDescription')}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-solid border-border-main/50 shrink-0">
          <span className="text-brand-emerald text-xs font-extrabold font-mono">
            {dish.price} {t('menu.currency')}
          </span>
          {dish.weight && (
            <span className="text-[9px] font-medium text-text-muted/60 font-mono">
              {dish.weight} {t('menu.constructor.dishes.modal.ingredients.units.g')}
            </span>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-20 bg-bg-surface/90 backdrop-blur-xs p-0.5 rounded-lg shadow-sm border border-border-main/40">
        <button
          type="button"
          onClick={() => onEdit(categoryId, dish)}
          className="p-1.5 rounded-md text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors cursor-pointer border-0 bg-transparent outline-none"
          title={t('menu.constructor.dishes.editBtn')}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete({ type: 'dish', id: dish.id })}
          className="p-1.5 rounded-md text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer border-0 bg-transparent outline-none"
          title={t('menu.constructor.dishes.deleteBtn')}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};