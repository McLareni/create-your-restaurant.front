'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Category } from '../types/categories.types';

interface CategoryItemProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryItem = ({ category, onEdit, onDelete }: CategoryItemProps) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between rounded-xl border p-3 mb-2 transition-colors ${
        isDragging ? 'bg-brand-cream/80 border-brand-copper shadow-md' : 'bg-white border-brand-gray/20 hover:border-brand-gray/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <button 
          className="cursor-grab text-brand-gray hover:text-brand-espresso active:cursor-grabbing outline-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="font-medium text-brand-espresso">{category.name}</span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(category)}
          className="p-2 text-brand-gray hover:text-brand-copper transition-colors outline-none"
          title={t('menu.constructor.categories.editBtn')}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(category.id)}
          className="p-2 text-brand-gray hover:text-red-500 transition-colors outline-none"
          title={t('menu.constructor.categories.deleteBtn')}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};