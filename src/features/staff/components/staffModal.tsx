'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input, Select, Switch } from '@/shared/ui';
import { CreateStaffDTO, StaffRole } from '../types/staff.types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: CreateStaffDTO;
  setFormData: React.Dispatch<React.SetStateAction<CreateStaffDTO>>;
  onSave: () => void;
  validationError: string | null;
  isLoading?: boolean;
}

export const StaffModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSave,
  validationError,
  isLoading = false
}: StaffModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Input id="firstName" label={t('staff.modal.firstNameLabel')} placeholder={t('staff.modal.firstNamePlaceholder')} value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} disabled={isLoading} />
          <Input id="lastName" label={t('staff.modal.lastNameLabel')} placeholder={t('staff.modal.lastNamePlaceholder')} value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} disabled={isLoading} />
        </div>
        <Input id="email" type="email" label={t('staff.modal.emailLabel')} placeholder={t('staff.modal.emailPlaceholder')} value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} disabled={isLoading} />
        
        <div className="grid grid-cols-2 gap-4">
          <Input id="phone" label={t('staff.modal.phoneLabel')} placeholder={t('staff.modal.phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} disabled={isLoading} />
          <Select id="role" label={t('staff.modal.roleLabel')} value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as StaffRole }))} disabled={isLoading}>
            <option value="MANAGER">{t('staff.roles.MANAGER')}</option>
            <option value="WAITER">{t('staff.roles.WAITER')}</option>
            <option value="CHEF">{t('staff.roles.CHEF')}</option>
            <option value="BARTENDER">{t('staff.roles.BARTENDER')}</option>
          </Select>
        </div>

        <div className="flex items-center justify-between border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4 mt-2">
          <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('staff.modal.statusLabel')}</span>
          <Switch checked={formData.isActive} onChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))} disabled={isLoading} />
        </div>

        {validationError && (
          <div className="text-sm text-red-500 font-medium animate-pulse">{validationError}</div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>{t('staff.modal.cancel')}</Button>
        <Button variant="brand" onClick={onSave} isLoading={isLoading} disabled={isLoading}>{t('staff.modal.save')}</Button>
      </div>
    </Modal>
  );
};