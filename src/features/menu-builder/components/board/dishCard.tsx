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

  // Оновлено: w-[240px] переведено в канонічний клас w-60 згідно з Tailwind v4
  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-60 h-56 rounded-xl bg-zinc-100 dark:bg-brand-gray/10 border border-dashed border-zinc-300 dark:border-brand-gray/30 opacity-40 shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      /* Оновлено: w-[240px] -> w-60 */
      className={`group relative flex flex-col w-60 h-56 bg-white dark:bg-brand-mocha/50 rounded-xl border border-zinc-100 dark:border-brand-gray/10 hover:border-brand-copper/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden shrink-0 ${
        !dish.isAvailable ? 'opacity-70 bg-zinc-50 dark:bg-zinc-900/20' : ''
      } ${isOverlay ? 'border-brand-copper/50 shadow-2xl bg-white dark:bg-brand-mocha scale-102' : ''}`}
    >
      {/* Upper section with image */}
      <div className="relative w-full h-28 bg-zinc-50 dark:bg-brand-gray/10 shrink-0 border-b border-zinc-50 dark:border-brand-gray/5">
        {dish.images && dish.images.length > 0 ? (
          <Image
            src={dish.images[0].url}
            alt={dish.name}
            fill
            sizes="240px"
            className="object-cover group-hover:scale-103 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 text-center font-medium p-2 leading-tight bg-zinc-100/50 dark:bg-zinc-900/20">
            {t('menu.public.noPhoto')}
          </div>
        )}

        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <div className="bg-zinc-900/80 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
              <EyeOff className="h-3 w-3" /> {t('inventory.statusStopped')}
            </div>
          </div>
        )}

        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-white/80 dark:bg-brand-mocha/80 rounded-md text-zinc-500 hover:text-brand-copper cursor-grab active:cursor-grabbing transition-colors shadow-xs z-10"
          title={t('menu.constructor.dishes.title')}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {dish.badge && dish.badge !== 'NONE' && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="text-[8px] px-1.5 py-0.5 font-extrabold rounded-md uppercase bg-brand-copper text-white tracking-wider shadow-xs">
              {t(`menu.constructor.badges.${dish.badge}`)}
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-brand-espresso dark:text-brand-cream truncate mb-0.5">
            {dish.name}
          </h4>
          <p className="text-[10px] text-zinc-400 dark:text-brand-cream/60 line-clamp-2 leading-tight">
            {dish.description || t('menu.public.noDescription')}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 dark:border-brand-gray/5 shrink-0">
          <span className="text-brand-copper dark:text-brand-copper/90 text-xs font-extrabold">
            {dish.price} {t('menu.currency')}
          </span>
          {dish.weight && (
            <span className="text-[9px] font-medium text-zinc-400 dark:text-brand-cream/40">
              {dish.weight} {t('menu.constructor.dishes.modal.ingredients.units.g')}
            </span>
          )}
        </div>
      </div>

      {/* Action panel */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-20 bg-white/90 dark:bg-brand-mocha/90 p-0.5 rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => onEdit(categoryId, dish)}
          className="p-1.5 rounded-md text-zinc-500 hover:text-brand-copper hover:bg-zinc-100 dark:hover:bg-brand-gray/20 transition-colors cursor-pointer"
          title={t('menu.constructor.dishes.editBtn')}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete({ type: 'dish', id: dish.id })}
          className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          title={t('menu.constructor.dishes.deleteBtn')}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};