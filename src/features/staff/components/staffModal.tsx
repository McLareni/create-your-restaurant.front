'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Select, Switch } from '@/shared/ui';
import { CreateStaffDTO, StaffRole } from '../types/staff.types';
import { Camera, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: CreateStaffDTO;
  setFormData: React.Dispatch<React.SetStateAction<CreateStaffDTO>>;
  onSave: () => void;
  errors?: Record<string, string>;
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
  errors = {},
  validationError,
  isLoading = false
}: StaffModalProps) => {
  const { t } = useTranslation();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading(t('menu.constructor.dishes.notifications.imageUploading'), { id: 'staff-img' });
    
    // Емуляція завантаження на сервер / переведення в Base64 для збереження в String поле
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result as string }));
      toast.success(t('menu.constructor.dishes.notifications.imageUploadSuccess'), { id: 'staff-img' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <FloatingPanel 
      panelId="staff-member-floating-panel"
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}
      className="w-144 border-brand-copper/20 shadow-2xl"
    >
      <div className="flex flex-col gap-5 text-brand-espresso dark:text-brand-cream">
        
        {/* Компонент завантаження та прев'ю фото профілю */}
        <div className="flex flex-col items-center justify-center gap-2 pb-2 self-center relative group">
          <div className="h-20 w-20 rounded-full border border-brand-gray/30 bg-brand-cream/40 flex items-center justify-center overflow-hidden relative shadow-inner">
            {formData.photo ? (
              <img src={formData.photo} alt="Staff preview" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-brand-gray/50" />
            )}
            <label htmlFor="staff-photo-input" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </label>
          </div>
          <input type="file" id="staff-photo-input" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={isLoading} />
          <span className="text-[11px] text-brand-gray font-medium">{t('menu.constructor.dishes.modal.changeImage')}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            id="firstName" 
            label={t('staff.modal.firstNameLabel')} 
            placeholder={t('staff.modal.firstNamePlaceholder')} 
            value={formData.firstName} 
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} 
            disabled={isLoading} 
            error={errors.firstName}
          />
          <Input 
            id="lastName" 
            label={t('staff.modal.lastNameLabel')} 
            placeholder={t('staff.modal.lastNamePlaceholder')} 
            value={formData.lastName || ''} 
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} 
            disabled={isLoading} 
            error={errors.lastName}
          />
        </div>
        <Input 
          id="email" 
          type="email" 
          label={t('staff.modal.emailLabel')} 
          placeholder={t('staff.modal.emailPlaceholder')} 
          value={formData.email} 
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} 
          disabled={isLoading} 
          error={errors.email}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            id="phone" 
            label={t('staff.modal.phoneLabel')} 
            placeholder={t('staff.modal.phonePlaceholder')} 
            value={formData.phone || ''} 
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
            disabled={isLoading} 
            error={errors.phone}
          />
          <Select 
            id="role" 
            label={t('staff.modal.roleLabel')} 
            value={formData.role} 
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as StaffRole }))} 
            disabled={isLoading}
            error={errors.role}
          >
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

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" className="h-9 text-xs font-semibold" onClick={onClose} disabled={isLoading}>{t('staff.modal.cancel')}</Button>
          <Button variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" onClick={onSave} isLoading={isLoading} disabled={isLoading}>{t('staff.modal.save')}</Button>
        </div>
      </div>
    </FloatingPanel>
  );
};