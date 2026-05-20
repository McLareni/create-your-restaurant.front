'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input, Checkbox } from '@/shared/ui';
import { modifierGroupSchema } from '../../schemas/modifiers.schema';

interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const ModifierGroupModal = ({ isOpen, onClose, isEditing, form, setForm, onSave, isLoading = false }: ModifierGroupModalProps) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  const handleValidateAndSave = () => {
    const payload = {
      name: form.name,
      isRequired: form.isRequired,
      minSelections: form.minSelections ? parseInt(form.minSelections, 10) : 0,
      maxSelections: form.maxSelections ? parseInt(form.maxSelections, 10) : null,
      options: form.options || []
    };

    const result = modifierGroupSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] ?? 'name';
        fieldErrors[path as string] = t(issue.message);
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('menu.constructor.modifiers.modal.group.editTitle') : t('menu.constructor.modifiers.modal.group.createTitle')}>
      <div className="flex flex-col gap-4">
        <Input 
          id="groupName" 
          label={t('menu.constructor.modifiers.modal.group.nameLabel')} 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          disabled={isLoading}
          error={errors.name}
        />
        <div className="flex gap-4">
          <Input 
            id="minSel" 
            type="number" 
            label={t('menu.constructor.modifiers.modal.group.minLabel')} 
            placeholder="0" 
            value={form.minSelections} 
            onChange={(e) => setForm({ ...form, minSelections: e.target.value })} 
            disabled={isLoading}
            error={errors.minSelections}
          />
          <Input 
            id="maxSel" 
            type="number" 
            label={t('menu.constructor.modifiers.modal.group.maxLabel')} 
            placeholder={t('menu.constructor.modifiers.modal.group.unlimited')} 
            value={form.maxSelections} 
            onChange={(e) => setForm({ ...form, maxSelections: e.target.value })} 
            disabled={isLoading}
            error={errors.maxSelections}
          />
        </div>
        <Checkbox 
          id="req" 
          label={t('menu.constructor.modifiers.modal.group.requiredLabel')} 
          checked={form.isRequired} 
          onChange={(e) => setForm({ ...form, isRequired: e.target.checked })} 
          disabled={isLoading}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-brand-gray/10 mt-2">
          <Button variant="ghost" onClick={onClose} className="h-9 text-sm" disabled={isLoading}>
            {t('menu.constructor.modifiers.modal.cancel')}
          </Button>
          <Button variant="brand" onClick={handleValidateAndSave} className="h-9 text-sm" disabled={isLoading} isLoading={isLoading}>
            {t('menu.constructor.modifiers.modal.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};