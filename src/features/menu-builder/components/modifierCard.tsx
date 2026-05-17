'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pencil, Trash2, Settings2 } from 'lucide-react';
import { ModifierGroup } from '../types/modifiers.types';
import { Card } from '@/shared/ui';

interface ModifierCardProps {
  modifier: ModifierGroup;
  onEdit: (mod: ModifierGroup) => void;
  onDelete: (id: string) => void;
}

export const ModifierCard = ({ modifier, onEdit, onDelete }: ModifierCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="!p-5">
      <div className="flex items-start justify-between mb-3 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-cream rounded-lg text-brand-copper">
            <Settings2 className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-brand-espresso line-clamp-1">{modifier.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(modifier)} className="p-1.5 text-brand-gray hover:text-brand-copper outline-none bg-white rounded-md shadow-sm">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(modifier.id)} className="p-1.5 text-brand-gray hover:text-red-500 outline-none bg-white rounded-md shadow-sm">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-brand-gray uppercase tracking-wider shrink-0 relative z-0">
        <span className="bg-brand-gray/10 px-2 py-1 rounded">
          {modifier.type === 'GROUP' ? t('menu.constructor.modifiers.modal.typeGroup') : t('menu.constructor.modifiers.modal.typeSingle')}
        </span>
        {modifier.type === 'GROUP' && (
          <span className="bg-brand-gray/10 px-2 py-1 rounded">
            {modifier.minSelect} - {modifier.maxSelect}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto border-t border-brand-gray/10 pt-3 relative z-0">
        {modifier.options.map(opt => (
          <div key={opt.id} className="flex justify-between items-center text-sm">
            <span className="text-brand-gray line-clamp-1 pr-2">{opt.name}</span>
            <span className="font-medium text-brand-espresso whitespace-nowrap">+{opt.price} {t('menu.currency')}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};