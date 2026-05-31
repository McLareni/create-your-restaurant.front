'use client';

import { useCharacteristicsTab } from '../../../hooks/useCharacteristicsTab';
import { Input, Checkbox, Button } from '@/shared/ui';
import { Plus, Tag, AlertTriangle, Trash2 } from 'lucide-react';
import { CharacteristicsTabProps, LookupSectionProps } from '../../../types/dishes.types';

const LookupSection = ({
  title,
  icon,
  placeholder,
  inputValue,
  onInputChange,
  onAdd,
  items,
  checkedItems,
  onToggle,
  onRemoveFromDb,
  emptyText,
  hasBorder = false
}: LookupSectionProps) => (
  <div className={`flex flex-col gap-3 h-full overflow-hidden ${hasBorder ? 'border-r border-brand-gray/10 pr-3' : ''}`}>
    <span className="text-xs font-semibold flex items-center gap-1.5 text-brand-espresso dark:text-brand-cream shrink-0">
      {icon}
      {title}
    </span>
    <div className="flex gap-2 shrink-0">
      <Input
        id={`lookup-input-${title}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        className="h-8 text-xs"
      />
      <Button 
        variant="outline" 
        type="button" 
        onClick={onAdd} 
        className="h-8 px-2.5 border-brand-copper text-brand-copper hover:bg-brand-copper hover:text-white transition-colors shrink-0"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
    <div className="grid grid-cols-1 gap-2 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 h-85 max-h-85 overflow-y-auto custom-scrollbar">
      {items.length === 0 ? (
        <span className="text-[11px] text-brand-gray italic p-4 text-center my-auto block">{emptyText}</span>
      ) : (
        items.map((item) => (
          <div key={item} className="bg-white dark:bg-brand-mocha p-1.5 rounded-lg border border-brand-gray/10 h-max flex items-center justify-between gap-2 animate-in fade-in duration-100">
            <Checkbox
              id={`lookup-item-${title}-${item}`}
              label={<span className="text-xs font-medium text-brand-espresso dark:text-brand-cream">{item}</span>}
              checked={checkedItems.includes(item)}
              onChange={(e) => onToggle(item, e.target.checked)}
            />
            <button
              type="button"
              onClick={() => onRemoveFromDb(item)}
              className="p-1 text-brand-gray hover:text-red-500 rounded transition-colors outline-none shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

export const CharacteristicsTab = ({ dishForm, setDishForm }: CharacteristicsTabProps) => {
  const state = useCharacteristicsTab(dishForm, setDishForm);

  return (
    <div className="grid grid-cols-2 gap-4 h-full min-h-0 select-none">
      <LookupSection
        title={state.t('menu.constructor.dishes.modal.properties.allergensTitle')}
        icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
        placeholder={state.t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}
        inputValue={state.newAllergen}
        onInputChange={state.setNewAllergen}
        onAdd={state.handleAddAllergen}
        items={state.allergens}
        checkedItems={dishForm.allergens || []}
        onToggle={state.handleToggleAllergen}
        onRemoveFromDb={state.handleRemoveAllergenFromDb}
        emptyText={state.t('menu.constructor.dishes.emptyTitle')}
        hasBorder
      />

      <LookupSection
        title={state.t('menu.constructor.dishes.modal.properties.tagsTitle')}
        icon={<Tag className="h-3.5 w-3.5 text-brand-copper" />}
        placeholder={state.t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
        inputValue={state.newTag}
        onInputChange={state.setNewTag}
        onAdd={state.handleAddTag}
        items={state.tags}
        checkedItems={dishForm.tags || []}
        onToggle={state.handleToggleTag}
        onRemoveFromDb={state.handleRemoveTagFromDb}
        emptyText={state.t('menu.constructor.dishes.emptyTitle')}
      />
    </div>
  );
};