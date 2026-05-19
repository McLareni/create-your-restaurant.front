'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Card } from '@/shared/ui';
import { Pencil, Trash2, Leaf, Flame, MilkOff, ImageIcon, GripHorizontal, AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DishCardProps {
  dish: any;
  categoryId: string;
  onEdit: (categoryId: string, dish: any) => void;
  onDelete: (dishId: string) => void;
}

export const DishCard = ({ dish, categoryId, onEdit, onDelete }: DishCardProps) => {
  const { t } = useTranslation();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dish.id,
    data: { type: 'Dish', categoryId }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const hasAllergens = dish.allergens && dish.allergens.length > 0;
  const allergensText = hasAllergens ? (Array.isArray(dish.allergens) ? dish.allergens.join(', ') : dish.allergens) : '';

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <Card className={`group flex flex-col h-full relative bg-white dark:bg-brand-mocha border border-brand-gray/10 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden rounded-xl ${isDragging ? 'ring-1 ring-brand-copper shadow-lg scale-[1.02]' : ''}`}>
        
        <div className={`absolute inset-0 z-40 bg-white/95 dark:bg-brand-mocha/95 backdrop-blur-md p-4 flex flex-col transition-transform duration-300 ${isDescExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between mb-3 border-b border-brand-gray/10 pb-2">
            <h4 className="font-bold text-sm text-brand-espresso dark:text-brand-cream">Опис страви</h4>
            <button onClick={(e) => { e.stopPropagation(); setIsDescExpanded(false); }} className="p-1 rounded-md bg-brand-gray/10 hover:bg-brand-gray/20 text-brand-gray outline-none transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-brand-gray leading-relaxed overflow-y-auto custom-scrollbar pr-1 flex-1 pb-4">
            {dish.description}
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full bg-brand-cream/50 dark:bg-brand-gray/5 flex items-center justify-center overflow-hidden shrink-0">
          {dish.image ? (
            <img src={dish.image} alt={dish.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <ImageIcon className="h-6 w-6 text-brand-gray/20" />
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          <div 
            {...attributes} 
            {...listeners}
            className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 dark:bg-black/60 text-brand-espresso dark:text-white opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all cursor-grab active:cursor-grabbing hover:bg-white shadow-sm"
          >
            <GripHorizontal className="h-3.5 w-3.5" />
          </div>

          <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5 items-end z-10">
            <Badge type={dish.badge} />
          </div>
        </div>
        
        <div className="flex flex-col flex-1 p-2.5">
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="font-semibold text-sm text-brand-espresso dark:text-brand-cream leading-tight line-clamp-2" title={dish.name}>
              {dish.name}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1.5">
            {dish.isVegan && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-50 text-green-600 border border-green-100" title="Веганське"><Leaf className="h-2.5 w-2.5"/></span>}
            {dish.isSpicy && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-50 text-red-600 border border-red-100" title="Гостре"><Flame className="h-2.5 w-2.5"/></span>}
            {dish.isLactoseFree && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-500 border border-blue-100" title="Без лактози"><MilkOff className="h-2.5 w-2.5"/></span>}
            {hasAllergens && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 cursor-help" title={`Алергени: ${allergensText}`}><AlertTriangle className="h-2.5 w-2.5"/></span>}
          </div>

          <div className="mb-2">
            <p className="text-[11px] text-brand-gray line-clamp-2 leading-relaxed">
              {dish.description}
            </p>
            {dish.description && dish.description.length > 60 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsDescExpanded(true); }}
                className="text-[10px] text-brand-copper font-medium hover:underline mt-0.5 outline-none"
              >
                Детальніше...
              </button>
            )}
          </div>
          
          <div className="mt-auto pt-2 flex items-center justify-between border-t border-brand-gray/5 dark:border-brand-gray/10">
            <p className="font-bold text-sm text-brand-copper">
              {dish.price} <span className="text-[10px] font-medium">{t('menu.currency')}</span>
            </p>
            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button onClick={() => onEdit(categoryId, dish)} className="p-1 rounded-md text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/20 transition-all outline-none cursor-pointer" title="Редагувати">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onDelete(dish.id)} className="p-1 rounded-md text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all outline-none cursor-pointer" title="Видалити">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};