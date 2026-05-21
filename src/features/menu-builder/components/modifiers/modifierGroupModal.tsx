'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Switch } from '@/shared/ui';

interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export const ModifierGroupModal = ({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  errors = {},
  isLoading = false
}: ModifierGroupModalProps) => {
  const { t } = useTranslation();

  return (
    <FloatingPanel
      panelId="modifier-group-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('menu.constructor.modifiers.modal.group.editTitle') : t('menu.constructor.modifiers.modal.group.createTitle')}
      className="w-132 border-brand-copper/20"
    >
      <div className="flex flex-col gap-4 text-brand-espresso dark:text-brand-cream">
        <Input
          id="groupName"
          label={t('menu.constructor.modifiers.modal.group.nameLabel')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={isLoading}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="minSelections"
            type="number"
            label={t('menu.constructor.modifiers.modal.group.minLabel')}
            placeholder="0"
            value={form.minSelections}
            onChange={(e) => setForm({ ...form, minSelections: e.target.value })}
            disabled={isLoading}
            error={errors.minSelections}
          />
          <Input
            id="maxSelections"
            type="number"
            label={t('menu.constructor.modifiers.modal.group.maxLabel')}
            placeholder={t('menu.constructor.modifiers.unlimited')}
            value={form.maxSelections}
            onChange={(e) => setForm({ ...form, maxSelections: e.target.value })}
            disabled={isLoading}
            error={errors.maxSelections}
          />
        </div>

        <div className="flex items-center justify-between border-t border-brand-gray/10 pt-4 mt-2">
          <div className="max-w-[75%]">
            <span className="block text-sm font-semibold text-brand-espresso dark:text-brand-cream">
              {t('menu.constructor.modifiers.modal.group.requiredLabel')}
            </span>
          </div>
          <Switch
            checked={form.isRequired}
            onChange={(val) => setForm({ ...form, isRequired: val, minSelections: val ? '1' : form.minSelections })}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-brand-gray/10">
          <Button variant="ghost" onClick={onClose} className="h-9 text-xs font-semibold" disabled={isLoading}>
            {t('menu.constructor.modifiers.modal.cancel')}
          </Button>
          <Button
            variant="brand"
            onClick={onSave}
            className="px-5 h-9 text-xs font-bold shadow-md"
            disabled={!form.name.trim() || isLoading}
            isLoading={isLoading}
          >
            {t('menu.constructor.modifiers.modal.save')}
          </Button>
        </div>
      </div>
    </FloatingPanel>
  );
};