'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pencil, Trash2, Settings2 } from 'lucide-react';
import { ModifierGroup } from '../types/modifiers.types';

interface ModifierCardProps {
  modifier: ModifierGroup;
  onEdit: (mod: ModifierGroup) => void;
  onDelete: (id: string) => void;
}

export const ModifierCard = ({ modifier, onEdit, onDelete }: ModifierCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative flex flex-col rounded-2xl border border-brand-gray/20 bg-white p-5 hover:border-brand-copper/50 transition-colors shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-cream rounded-lg text-brand-copper">
            <Settings2 className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-brand-espresso">{modifier.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(modifier)} className="p-1.5 text-brand-gray hover:text-brand-copper outline-none">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(modifier.id)} className="p-1.5 text-brand-gray hover:text-red-500 outline-none">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-brand-gray uppercase tracking-wider">
        <span className="bg-brand-gray/10 px-2 py-1 rounded">
          {modifier.type === 'GROUP' ? t('menu.constructor.modifiers.modal.typeGroup') : t('menu.constructor.modifiers.modal.typeSingle')}
        </span>
        {modifier.type === 'GROUP' && (
          <span className="bg-brand-gray/10 px-2 py-1 rounded">
            {modifier.minSelect} - {modifier.maxSelect}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto border-t border-brand-gray/10 pt-3">
        {modifier.options.map(opt => (
          <div key={opt.id} className="flex justify-between items-center text-sm">
            <span className="text-brand-gray">{opt.name}</span>
            <span className="font-medium text-brand-espresso">+{opt.price} ₴</span>
          </div>
        ))}
      </div>
    </div>
  );
};