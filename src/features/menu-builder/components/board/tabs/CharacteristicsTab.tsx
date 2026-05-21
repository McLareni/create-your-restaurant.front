'use client';

import { useState } from 'react';
import { Input, Checkbox, Button } from '@/shared/ui';
import { Plus, Tag, AlertTriangle, Trash2 } from 'lucide-react';
import { useAllergens } from '../../../hooks/useAllergens';
import { useDishTags } from '../../../hooks/useDishTags';
import { DishFormValues } from '../../../schemas/dishes.schema';
import { useTranslation } from '@/shared/hooks/useTranslation';

interface CharacteristicsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
}

export const CharacteristicsTab = ({ dishForm, setDishForm }: CharacteristicsTabProps) => {
  const { t } = useTranslation();
  const { allergens, createAllergen, deleteAllergen } = useAllergens();
  const { tags, createTag, deleteTag } = useDishTags();
  
  const [newAllergen, setNewAllergen] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddAllergen = () => {
    const formatted = newAllergen.trim();
    if (!formatted) return;
    createAllergen(formatted);
    const currentAllergens = dishForm.allergens || [];
    if (!currentAllergens.includes(formatted)) {
      setDishForm({ ...dishForm, allergens: [...currentAllergens, formatted] });
    }
    setNewAllergen('');
  };

  const handleAddTag = () => {
    const formatted = newTag.trim();
    if (!formatted) return;
    createTag(formatted);
    const currentTags = dishForm.tags || [];
    if (!currentTags.includes(formatted)) {
      setDishForm({ ...dishForm, tags: [...currentTags, formatted] });
    }
    setNewTag('');
  };

  const handleToggleAllergen = (item: string, checked: boolean) => {
    const current = dishForm.allergens || [];
    const next = checked ? [...current, item] : current.filter((a: string) => a !== item);
    setDishForm({ ...dishForm, allergens: next });
  };

  const handleToggleTag = (item: string, checked: boolean) => {
    const current = dishForm.tags || [];
    const next = checked ? [...current, item] : current.filter((t: string) => t !== item);
    setDishForm({ ...dishForm, tags: next });
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full min-h-0">
      <div className="flex flex-col gap-3 border-r border-brand-gray/10 pr-3 h-full overflow-hidden">
        <span className="text-xs font-semibold flex items-center gap-1.5 text-brand-espresso dark:text-brand-cream shrink-0">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> 
          {t('menu.constructor.dishes.modal.properties.allergensTitle')}
        </span>
        <div className="flex gap-2 shrink-0">
          <Input
            id="new-allergen-input"
            placeholder={t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}
            value={newAllergen}
            onChange={(e) => setNewAllergen(e.target.value)}
            className="h-8 text-xs"
          />
          <Button variant="outline" type="button" onClick={handleAddAllergen} className="h-8 px-2 border-brand-copper text-brand-copper">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 h-85 max-h-85 overflow-y-auto custom-scrollbar">
          {allergens.map((item) => (
            <div key={item} className="bg-white dark:bg-brand-mocha p-1.5 rounded-lg border border-brand-gray/10 h-max flex items-center justify-between gap-2">
              <Checkbox
                id={`allergen-${item}`}
                label={<span className="text-xs font-medium">{item}</span>}
                checked={dishForm.allergens?.includes(item)}
                onChange={(e) => handleToggleAllergen(item, e.target.checked)}
              />
              <button
                type="button"
                onClick={() => deleteAllergen(item)}
                className="p-1 text-brand-gray hover:text-red-500 rounded transition-colors outline-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <span className="text-xs font-semibold flex items-center gap-1.5 text-brand-copper shrink-0">
          <Tag className="h-3.5 w-3.5" /> 
          {t('menu.constructor.dishes.modal.properties.tagsTitle')}
        </span>
        <div className="flex gap-2 shrink-0">
          <Input
            id="new-tag-input"
            placeholder={t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="h-8 text-xs"
          />
          <Button variant="outline" type="button" onClick={handleAddTag} className="h-8 px-2 border-brand-copper text-brand-copper">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 h-85 max-h-85 overflow-y-auto custom-scrollbar">
          {tags.map((item) => (
            <div key={item} className="bg-white dark:bg-brand-mocha p-1.5 rounded-lg border border-brand-gray/10 h-max flex items-center justify-between gap-2">
              <Checkbox
                id={`tag-${item}`}
                label={<span className="text-xs font-medium">{item}</span>}
                checked={dishForm.tags?.includes(item)}
                onChange={(e) => handleToggleTag(item, e.target.checked)}
              />
              <button
                type="button"
                onClick={() => deleteTag(item)}
                className="p-1 text-brand-gray hover:text-red-500 rounded transition-colors outline-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};