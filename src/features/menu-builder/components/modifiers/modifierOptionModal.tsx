'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input, Switch } from '@/shared/ui';

interface ModifierOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const ModifierOptionModal = ({ isOpen, onClose, isEditing, form, setForm, onSave, isLoading = false }: ModifierOptionModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('menu.constructor.modifiers.modal.option.editTitle') : t('menu.constructor.modifiers.modal.option.createTitle')}>
      <div className="flex flex-col gap-4">
        <Input 
          id="optName" 
          label={t('menu.constructor.modifiers.modal.option.nameLabel')} 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          disabled={isLoading}
        />
        <Input 
          id="optPrice" 
          type="number" 
          label={t('menu.constructor.modifiers.modal.option.priceLabel')} 
          placeholder="0" 
          value={form.price} 
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
          disabled={isLoading}
        />
        <div className="flex items-center justify-between border-t border-brand-gray/10 pt-4 mt-2">
          <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('menu.constructor.modifiers.modal.option.availableLabel')}</span>
          <Switch checked={form.isAvailable} onChange={(val) => setForm({ ...form, isAvailable: val })} disabled={isLoading} />
        </div>
        <div className="flex justify-end gap-2 pt-4 mt-2">
          <Button variant="ghost" onClick={onClose} className="h-9 text-sm" disabled={isLoading}>
            {t('menu.constructor.modifiers.modal.cancel')}
          </Button>
          <Button 
            variant="brand" 
            onClick={onSave} 
            className="h-9 text-sm" 
            disabled={!form.name.trim() || isLoading}
            isLoading={isLoading}
          >
            {t('menu.constructor.modifiers.modal.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};