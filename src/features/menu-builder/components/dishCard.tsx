'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Card } from '@/shared/ui';
import { ImagePlus, Pencil, Trash2, Flame, Leaf, MilkOff } from 'lucide-react';
import { Dish } from '../types/dishes.types';

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
}

export const DishCard = ({ dish, onEdit, onDelete }: DishCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-0!">
      <div className="h-40 w-full shrink-0 bg-brand-cream dark:bg-brand-mocha/50 flex items-center justify-center relative">
        <ImagePlus className="h-8 w-8 text-brand-gray/40 dark:text-brand-gray/60" />
        {dish.badge !== 'NONE' && (
          <div className="absolute top-3 right-3 rounded-full bg-brand-copper px-3 py-1 text-xs font-bold text-white shadow-md">
            {t(`menu.constructor.badges.${dish.badge}`)}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-brand-espresso dark:text-brand-cream text-lg leading-tight">{dish.name}</h3>
          <span className="font-bold text-brand-copper whitespace-nowrap ml-2">{dish.price} {t('menu.currency')}</span>
        </div>
        <p className="text-sm text-brand-gray dark:text-brand-gray/80 line-clamp-2 mb-3">{dish.description}</p>
        
        <div className="mt-auto pt-3 border-t border-brand-gray/10 dark:border-brand-gray/20 flex items-center justify-between text-xs text-brand-gray dark:text-brand-gray/80">
          <div className="flex items-center gap-2">
            <span>{dish.weight}</span>
            <span className="w-1 h-1 rounded-full bg-brand-gray/40 dark:bg-brand-gray/60"></span>
            <span>{dish.cookingTime} хв</span>
          </div>
          <div className="flex gap-1.5">
            {dish.isVegan && <Leaf className="h-4 w-4 text-green-500" />}
            {dish.isSpicy && <Flame className="h-4 w-4 text-red-500" />}
            {dish.isLactoseFree && <MilkOff className="h-4 w-4 text-blue-400" />}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white/90 dark:bg-brand-espresso/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm z-10 rounded-xl">
        <Button 
          variant="brand" 
          icon={<Pencil className="h-4 w-4" />} 
          onClick={() => onEdit(dish)}
        >
          {t('menu.constructor.dishes.editBtn')}
        </Button>
        <Button 
          variant="brand" 
          className="bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-md" 
          icon={<Trash2 className="h-4 w-4" />} 
          onClick={() => onDelete(dish.id)}
        >
          {t('menu.constructor.dishes.deleteBtn')}
        </Button>
      </div>
    </Card>
  );
};