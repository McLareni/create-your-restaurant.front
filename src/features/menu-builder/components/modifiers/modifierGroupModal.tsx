'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input, Checkbox } from '@/shared/ui';

interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
}

export const ModifierGroupModal = ({ isOpen, onClose, isEditing, form, setForm, onSave }: ModifierGroupModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('menu.constructor.modifiers.modal.group.editTitle') : t('menu.constructor.modifiers.modal.group.createTitle')}>
      <div className="flex flex-col gap-4">
        <Input 
          id="groupName" 
          label={t('menu.constructor.modifiers.modal.group.nameLabel')} 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        <div className="flex gap-4">
          <Input 
            id="minSel" 
            type="number" 
            label={t('menu.constructor.modifiers.modal.group.minLabel')} 
            placeholder="0" 
            value={form.minSelections} 
            onChange={(e) => setForm({ ...form, minSelections: e.target.value })} 
          />
          <Input 
            id="maxSel" 
            type="number" 
            label={t('menu.constructor.modifiers.modal.group.maxLabel')} 
            placeholder={t('menu.constructor.modifiers.modal.group.unlimited')} 
            value={form.maxSelections} 
            onChange={(e) => setForm({ ...form, maxSelections: e.target.value })} 
          />
        </div>
        <Checkbox 
          id="req" 
          label={t('menu.constructor.modifiers.modal.group.requiredLabel')} 
          checked={form.isRequired} 
          onChange={(e) => setForm({ ...form, isRequired: e.target.checked })} 
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-brand-gray/10 mt-2">
          <Button variant="ghost" onClick={onClose} className="h-9 text-sm">{t('menu.constructor.modifiers.modal.cancel')}</Button>
          <Button variant="brand" onClick={onSave} className="h-9 text-sm" disabled={!form.name.trim()}>{t('menu.constructor.modifiers.modal.save')}</Button>
        </div>
      </div>
    </Modal>
  );
};