'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Card } from '@/shared/ui';
import {
  Pencil,
  Trash2,
  ImageIcon,
  GripHorizontal,
  AlertTriangle,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../../../../shared/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dish } from '../../types/dishes.types';

interface DishCardProps {
  dish: Dish;
  categoryId: string;
  onEdit: (categoryId: string, dish: Dish) => void;
  onDelete: (dishId: string) => void;
  isOverlay?: boolean;
}

export const DishCard = ({ dish, categoryId, onEdit, onDelete, isOverlay = false }: DishCardProps) => {
  const { t } = useTranslation();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageUrls =
    dish.images?.map((image) => image.url) || (dish.imageUrl ? [dish.imageUrl] : []);

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageUrls.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageUrls.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1,
    );
  };
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: isOverlay ? `overlay-${dish.id}` : dish.id,
    disabled: isOverlay,
    data: { type: 'Dish', categoryId }
  });

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const hasAllergens = dish.allergens && dish.allergens.length > 0;
  const allergensText = hasAllergens ? dish.allergens.join(', ') : '';
  const hasVariants = dish.variants && dish.variants.length > 0;

  return (
    <div ref={isOverlay ? null : setNodeRef} style={style} className="h-full max-w-70 w-full">
      <Card className={`group flex flex-col h-full min-h-40 relative bg-white dark:bg-brand-mocha border border-brand-gray/10 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden rounded-xl ${isDragging ? 'ring-1 ring-brand-copper shadow-lg scale-[1.02]' : ''}`}>
        
        <div className={`absolute inset-0 z-40 bg-white/95 dark:bg-brand-mocha/95 backdrop-blur-md p-3 flex flex-col transition-transform duration-300 ${isDescExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between mb-2 border-b border-brand-gray/10 pb-1.5">
            <h4 className="font-bold text-xs text-brand-espresso dark:text-brand-cream">{t('menu.constructor.dishes.descTitle')}</h4>
            <button onClick={(e) => { e.stopPropagation(); setIsDescExpanded(false); }} className="p-1 rounded-md bg-brand-gray/10 hover:bg-brand-gray/20 text-brand-gray outline-none transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-brand-gray leading-relaxed overflow-y-auto custom-scrollbar pr-1 flex-1 pb-2">
            <p className="mb-2">{dish.description}</p>
            {dish.sku && <p className="text-[10px] font-mono mt-1 text-brand-copper">SKU: {dish.sku}</p>}
            {dish.taxRate !== undefined && <p className="text-[10px] text-brand-gray/80 mt-0.5">{t('menu.constructor.dishes.modal.taxText')}: {dish.taxRate}%</p>}
          </div>
        </div>

        <div className="relative aspect-video w-full bg-brand-cream/50 dark:bg-brand-gray/5 flex items-center justify-center overflow-hidden shrink-0 border-b border-brand-gray/5">
          {imageUrls.length > 0 ? (
            <img
              src={imageUrls[activeImageIndex]}
              alt={dish.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-brand-gray/20" />
          )}

          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div 
            {...attributes} 
            {...listeners}
            className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 dark:bg-black/60 text-brand-espresso dark:text-white opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all cursor-grab active:cursor-grabbing shadow-xs"
          >
            <GripHorizontal className="h-3 w-3" />
          </div>
          <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5 items-end z-10">
            {dish.badge && dish.badge !== 'NONE' && <Badge type={dish.badge} />}
          </div>
        </div>
        
        <div className="flex flex-col flex-1 p-3">
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="font-semibold text-xs text-brand-espresso dark:text-brand-cream leading-tight line-clamp-1" title={dish.name}>
              {dish.name}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1.5">
            {dish.tags?.map((tag) => (
              <span key={tag} className="flex items-center justify-center h-4 px-1.5 rounded-full bg-brand-cream text-brand-copper border border-brand-gray/10 text-[9px] font-bold" title={tag}>
                {tag}
              </span>
            ))}
            {hasAllergens && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 cursor-help" title={`${t('menu.constructor.dishes.modal.allergensLabel')}: ${allergensText}`}><AlertTriangle className="h-2.5 w-2.5"/></span>}
            {dish.modifierIds && dish.modifierIds.length > 0 && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-50 text-purple-600 border border-purple-100" title={t('menu.constructor.dishes.modal.hasModifiers')}><ShieldAlert className="h-2.5 w-2.5"/></span>}
          </div>

          <div className="mb-2 min-h-8">
            <p className="text-[11px] text-brand-gray line-clamp-2 leading-relaxed">
              {dish.description || t('menu.constructor.dishes.modal.descPlaceholder')}
            </p>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between border-t border-brand-gray/5 dark:border-brand-gray/10">
            <div>
              {hasVariants ? (
                <p className="font-bold text-xs text-brand-copper">
                  {t('menu.constructor.dishes.moreBtn')} {dish.variants[0].price} ₴
                </p>
              ) : (
                <p className="font-bold text-xs text-brand-copper">
                  {dish.price} <span className="text-[9px] font-medium">{t('menu.currency')}</span>
                </p>
              )}
            </div>
            
            <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              {dish.description && (
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="text-[10px] font-medium text-brand-gray hover:text-brand-copper px-1.5 py-0.5 rounded-md hover:bg-brand-cream/50 transition-colors"
                >
                  {t('menu.constructor.dishes.moreBtn')}
                </button>
              )}
              <button onClick={() => onEdit(categoryId, dish)} className="p-1 rounded-md text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/20 transition-all outline-none" title={t('menu.constructor.dishes.editBtn')}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onDelete(dish.id)} className="p-1 rounded-md text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all outline-none" title={t('menu.constructor.dishes.deleteBtn')}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};