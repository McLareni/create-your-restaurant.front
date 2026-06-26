'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui/button';
import { FloatingPanel } from '@/shared/ui/floatingPanel';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Switch } from '@/shared/ui/switch';
import { Camera, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useStaffForm } from '@/features/staff/hooks/useStaffForm';
import type { CustomStaffRole, StaffModalViewProps } from '@/features/staff/types/staff.types';

export const StaffModalView = ({
  isOpen,
  onClose,
  editingMember,
  roles,
  validationError,
  isFormPending,
  onFormSuccess,
}: StaffModalViewProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    fields,
    handleFieldChange,
    isActiveStatus,
    setIsActiveStatus,
    photoPreview,
    handlePhotoChange,
    errors,
    formAction,
  } = useStaffForm(roles, editingMember, onFormSuccess);

  return (
    <FloatingPanel 
      panelId="staff-member-floating-panel"
      isOpen={isOpen} 
      onClose={onClose}
      title={editingMember ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}
      className="max-w-xl"
    >
      <form action={formAction} className="flex flex-col gap-4 text-text-main">
        <div className="flex flex-col items-center justify-center py-2 shrink-0">
          <div className="relative group w-24 h-24 rounded-full border-2 border-border-main bg-bg-main overflow-hidden flex items-center justify-center shadow-inner">
            {photoPreview ? (
              <Image src={photoPreview} alt="Preview" fill unoptimized className="object-cover" />
            ) : (
              <User className="h-10 w-10 text-text-muted" />
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
              <input type="file" accept="image/*" name="photo" className="hidden" onChange={handlePhotoChange} disabled={isFormPending} />
            </label>
          </div>
          <span className="text-xs text-text-muted mt-2 font-medium">{t('staff.modal.photoLabel')}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0">
          <Input id="firstName" name="firstName" label={t('staff.modal.firstNameLabel')} placeholder={t('staff.modal.firstNamePlaceholder')} value={fields.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} error={errors.firstName} disabled={isFormPending} />
          <Input id="lastName" name="lastName" label={t('staff.modal.lastNameLabel')} placeholder={t('staff.modal.lastNamePlaceholder')} value={fields.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} error={errors.lastName} disabled={isFormPending} />
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0">
          <Input id="email" name="email" type="email" label={t('staff.modal.emailLabel')} placeholder={t('staff.modal.emailPlaceholder')} value={fields.email} onChange={(e) => handleFieldChange('email', e.target.value)} error={errors.email} disabled={isFormPending} />
          <Input id="phone" name="phone" type="tel" label={t('staff.modal.phoneLabel')} placeholder={t('staff.modal.phonePlaceholder')} value={fields.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} error={errors.phone} disabled={isFormPending} />
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <Select id="role" name="role" label={t('staff.modal.roleLabel')} value={fields.role} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFieldChange('role', e.target.value)} error={errors.role} disabled={isFormPending}>
            <option value="">{t('staff.modal.rolePlaceholder')}</option>
            {roles.map((r: CustomStaffRole) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1 relative shrink-0">
          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} label={t('staff.modal.passwordLabel')} placeholder={editingMember ? t('staff.modal.passwordPlaceholderEdit') : t('staff.modal.passwordPlaceholderCreate')} value={fields.password} onChange={(e) => handleFieldChange('password', e.target.value)} error={errors.password} disabled={isFormPending} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-text-muted hover:text-brand-emerald transition-colors outline-none cursor-pointer" disabled={isFormPending}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          
          {editingMember && (
            <div className="flex items-center gap-1.5 mt-1 px-1">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">{t('staff.modal.passwordSet')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border-main pt-4 mt-1 shrink-0">
          <span className="text-sm font-medium text-text-main">{t('staff.modal.statusLabel')}</span>
          <Switch checked={isActiveStatus} onChange={setIsActiveStatus} disabled={isFormPending} />
        </div>

        {validationError && (
          <div className="text-sm text-red-500 font-medium animate-pulse shrink-0">{validationError}</div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border-main mt-auto">
          <Button type="button" variant="ghost" className="h-9 text-xs font-semibold" onClick={onClose} disabled={isFormPending}>
            {t('staff.modal.cancel')}
          </Button>
          <Button type="submit" variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" isLoading={isFormPending} disabled={isFormPending}>
            {t('staff.modal.save')}
          </Button>
        </div>
      </form>
    </FloatingPanel>
  );
};