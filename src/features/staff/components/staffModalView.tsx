'use client';

import Image from 'next/image';
import { Button, FloatingPanel, Input, Select, Switch } from '@/shared/ui';
import { Camera, User, Plus, Trash2, Eye, EyeOff, ShieldCheck, ShieldAlert } from 'lucide-react';
import { StaffModalViewProps } from '../types/staff.types';

export const StaffModalView = ({
  isOpen, isEditing, formData, roles, hasPassword = false, errors = {},
  validationError, isLoading = false, onSave, t, newRoleName, setNewRoleName,
  isCreatingRole, showPassword, setShowPassword, handlePhotoChange,
  handleCleanClose, handleAddRole, handleRemoveRole, onFieldChange
}: StaffModalViewProps) => {
  return (
    <FloatingPanel 
      panelId="staff-member-floating-panel"
      isOpen={isOpen} 
      onClose={handleCleanClose} 
      title={isEditing ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}
      className="w-full max-w-xl border-brand-copper/20 shadow-2xl"
    >
      <div className="flex flex-col gap-5 text-brand-espresso dark:text-brand-cream">
        
        <div className="flex flex-col items-center justify-center gap-2 pb-2 self-center relative group">
          <div className="h-20 w-20 rounded-full border border-brand-gray/30 bg-brand-cream/40 flex items-center justify-center overflow-hidden relative shadow-inner">
            {formData.photo ? (
              <Image 
                src={formData.photo} 
                alt="Staff preview" 
                fill 
                unoptimized={formData.photo.startsWith('blob:') || formData.photo.startsWith('data:')}
                className="object-cover" 
              />
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
            onChange={(e) => onFieldChange('firstName', e.target.value)} 
            disabled={isLoading} 
            error={errors.firstName}
          />
          <Input 
            id="lastName" 
            label={t('staff.modal.lastNameLabel')} 
            placeholder={t('staff.modal.lastNamePlaceholder')} 
            value={formData.lastName || ''} 
            onChange={(e) => onFieldChange('lastName', e.target.value)} 
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
          onChange={(e) => onFieldChange('email', e.target.value)} 
          disabled={isLoading} 
          error={errors.email}
        />
        
        <div className="grid grid-cols-2 gap-4 items-end">
          <Input 
            id="phone" 
            label={t('staff.modal.phoneLabel')} 
            placeholder={t('staff.modal.phonePlaceholder')} 
            value={formData.phone || ''} 
            onChange={(e) => onFieldChange('phone', e.target.value)} 
            disabled={isLoading} 
            error={errors.phone}
          />
          <Select 
            id="role" 
            label={t('staff.modal.roleLabel')} 
            value={formData.role} 
            onChange={(e) => onFieldChange('role', e.target.value)} 
            disabled={isLoading}
            error={errors.role}
          >
            <option value="" disabled>{t('staff.modal.rolePlaceholder')}</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </Select>
        </div>

        <div className="bg-brand-cream/40 dark:bg-brand-espresso/30 border border-brand-gray/20 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-brand-espresso dark:text-brand-cream">{t('staff.modal.addRoleLabel')}</span>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input 
                id="new-role-input"
                placeholder={t('staff.modal.addRolePlaceholder')}
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                disabled={isLoading || isCreatingRole}
                className="h-10 border-brand-gray/30"
              />
            </div>
            <Button 
              type="button" 
              variant="brand" 
              className="h-10! px-4 text-xs font-bold shrink-0" 
              onClick={handleAddRole}
              disabled={isLoading || isCreatingRole || !newRoleName.trim()}
              icon={<Plus className="h-3.5 w-3.5" />}
            >
              {t('staff.modal.addRoleBtn')}
            </Button>
          </div>
          {roles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 max-h-24 overflow-y-auto custom-scrollbar">
              {roles.map((r) => (
                <div key={r.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-brand-mocha border border-brand-gray/20 text-xs font-medium text-brand-espresso dark:text-brand-cream group/tag">
                  <span>{r.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => handleRemoveRole(e, r.id, r.name)}
                    className="text-brand-gray hover:text-red-500 transition-colors outline-none cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            label={t('staff.modal.passwordLabel')} 
            placeholder={isEditing ? t('staff.modal.passwordPlaceholderEdit') : t('staff.modal.passwordPlaceholderCreate')} 
            value={formData.password || ''} 
            onChange={(e) => onFieldChange('password', e.target.value)} 
            disabled={isLoading} 
            error={errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-gray hover:text-brand-copper transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {isEditing && (
            <div className="flex items-center gap-1.5 px-1 mt-0.5">
              {hasPassword ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    {t('staff.modal.passwordSet')}
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">
                    {t('staff.modal.passwordNotSet')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4 mt-2">
          <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('staff.modal.statusLabel')}</span>
          <Switch checked={formData.isActive} onChange={(val) => onFieldChange('isActive', val)} disabled={isLoading} />
        </div>

        {validationError && (
          <div className="text-sm text-red-500 font-medium animate-pulse">{validationError}</div>
        )}

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" className="h-9 text-xs font-semibold" onClick={handleCleanClose} disabled={isLoading}>{t('staff.modal.cancel')}</Button>
          <Button variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" onClick={onSave} isLoading={isLoading} disabled={isLoading}>{t('staff.modal.save')}</Button>
        </div>
      </div>
    </FloatingPanel>
  );
};