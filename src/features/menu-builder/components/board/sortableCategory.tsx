'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/shared/ui';
import { Plus, GripVertical, Pencil, Trash2, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { DishCard } from './dishCard';
import { Dish } from '../../types/dishes.types';
import { SortableCategoryProps } from '../../types/categories.types';

export const SortableCategory = ({ category, categoryDishes, onEditCategory, onDeleteCategory, onAddDish, onEditDish, onDeleteCategoryDish, t }: SortableCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: category.id,
    data: { type: 'Category' }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex flex-col rounded-xl bg-brand-cream/10 dark:bg-brand-mocha/5 p-2 w-full transition-all duration-300 ${isDragging ? 'ring-1 ring-brand-copper/30 shadow-xl scale-[1.01] bg-white' : ''}`}>
      <div className="flex items-center justify-between rounded-lg bg-white dark:bg-brand-mocha p-2 border border-brand-gray/10 shadow-xs hover:border-brand-copper/20 transition-colors z-10 w-full">
        
        <div className="flex items-center gap-1 flex-1">
          <button 
            type="button"
            className="p-1.5 rounded-md text-brand-gray hover:bg-brand-cream dark:hover:bg-brand-gray/10 transition-colors shrink-0 outline-none cursor-pointer" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-md text-brand-gray/40 hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/10 transition-colors outline-none shrink-0"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <div 
            className="flex flex-1 items-center gap-2 cursor-pointer select-none ml-1 py-1" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div>
              <h2 className="text-xs font-bold text-brand-espresso dark:text-brand-cream tracking-tight">
                {category.name}
              </h2>
              <span className="text-[10px] font-medium text-brand-gray">
                {categoryDishes.length} {t('menu.constructor.tabs.dishes').toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onEditCategory(category)} className="p-1.5 rounded-md text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/10 transition-all outline-none cursor-pointer">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onDeleteCategory({ type: 'category', id: category.id })} className="p-1.5 rounded-md text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all outline-none mr-1 cursor-pointer">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          
          <Button 
            variant="outline" 
            onClick={() => onAddDish(category.id)}
            className="h-7 text-[11px] px-2.5 border-brand-copper text-brand-copper bg-transparent hover:bg-brand-copper hover:text-white transition-colors font-medium shadow-xs rounded-md"
            icon={<Plus className="h-3 w-3" />}
          >
            <span className="hidden sm:inline">{t('menu.constructor.dishes.addBtn')}</span>
          </Button>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out origin-top w-full ${isExpanded ? 'max-h-500 opacity-100 mt-2 scale-y-100' : 'max-h-0 opacity-0 overflow-hidden scale-y-95'}`}>
        <SortableContext items={categoryDishes.map((d: Dish) => d.id)} strategy={rectSortingStrategy}>
          {categoryDishes.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 px-1 pb-1 items-start w-full justify-items-start">
              {categoryDishes.map((dish: Dish) => (
                <DishCard 
                  key={dish.id} 
                  dish={dish} 
                  categoryId={category.id} 
                  onEdit={onEditDish} 
                  onDelete={(id: string) => onDeleteCategoryDish({ type: 'dish', id })} 
                />
              ))}
            </div>
          ) : (
            <div className="mx-1 mb-1 rounded-xl border border-dashed border-brand-gray/20 bg-white/40 dark:bg-brand-mocha/10 p-4 text-center transition-colors hover:border-brand-copper/30 hover:bg-white flex flex-col items-center justify-center gap-1.5 w-full">
              <Star className="h-4 w-4 text-brand-gray/30" />
              <p className="text-brand-gray font-medium text-[11px]">
                {t('menu.constructor.dishes.emptyTitle')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => onAddDish(category.id)} 
                className="mt-0.5 h-6 text-[10px] border-brand-copper text-brand-copper hover:bg-brand-copper hover:text-white px-2.5 rounded-md"
              >
                {t('menu.constructor.dishes.addBtn')}
              </Button>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};