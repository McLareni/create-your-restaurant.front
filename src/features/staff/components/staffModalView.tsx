'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { FloatingPanel, Switch, Checkbox, FloatingSidePanel, ConfirmModal } from '@/shared/ui';
import { useStaffRoles } from '@/features/staff/hooks/useStaffRoles';
import { Camera, User, Eye, EyeOff, ShieldCheck, Trash2, Plus, X } from 'lucide-react';
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
  const [isRolesPanelOpen, setIsRolesPanelOpen] = useState(false);
  const [roleDeleteId, setRoleDeleteId] = useState<string | null>(null);
  const roleLogic = useStaffRoles();

  const {
    selectedRole,
    setSelectedRole,
    isActiveStatus,
    setIsActiveStatus,
    photoPreview,
    handlePhotoChange,
    errors,
    formValues,
    formAction,
    isPending,
  } = useStaffForm(editingMember, onFormSuccess);

  const handleCloseAll = () => {
    setIsRolesPanelOpen(false);
    setRoleDeleteId(null);
    onClose();
  };

  const displayRoleName = ['OWNER', 'STAFF', 'CUSTOMER'].includes(selectedRole)
    ? t(`roles.${selectedRole}`)
    : selectedRole;

  const combinedPending = isFormPending || isPending;

  return (
    <>
      <FloatingPanel 
        panelId="staff-member-floating-panel"
        isOpen={isOpen} 
        onClose={handleCloseAll}
        title={editingMember ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}
        className="main-staff-panel max-w-xl animate-in fade-in duration-200"
      >
        <form action={formAction} className="flex flex-col gap-4 text-text-main w-full [&_input:not([type=checkbox])]:bg-bg-main/40! [&_input:not([type=checkbox])]:text-text-main! [&_input:not([type=checkbox])]:border-border-main/60! [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:focus:border-brand-emerald/50!">
          <input type="hidden" name="role" value={selectedRole} />

          <div className="flex flex-col items-center justify-center py-2 shrink-0">
            <div className="relative group w-24 h-24 rounded-full border-2 border-border-main bg-bg-main overflow-hidden flex items-center justify-center shadow-inner">
              {photoPreview ? (
                <Image src={photoPreview} alt="Preview" fill unoptimized className="object-cover" />
              ) : (
                <User className="h-10 w-10 text-text-muted" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
                <input type="file" accept="image/*" name="photo" className="hidden" onChange={handlePhotoChange} disabled={combinedPending} />
              </label>
            </div>
            <span className="text-xs text-text-muted mt-2 font-medium">{t('staff.modal.photoLabel')}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0">
            <Input id="firstName" name="firstName" label={t('staff.modal.firstNameLabel')} placeholder={t('staff.modal.firstNamePlaceholder')} defaultValue={formValues.firstName} error={errors.firstName} disabled={combinedPending} />
            <Input id="lastName" name="lastName" label={t('staff.modal.lastNameLabel')} placeholder={t('staff.modal.lastNamePlaceholder')} defaultValue={formValues.lastName} error={errors.lastName} disabled={combinedPending} />
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0">
            <Input id="email" name="email" type="email" label={t('staff.modal.emailLabel')} placeholder={t('staff.modal.emailPlaceholder')} defaultValue={formValues.email} error={errors.email} disabled={combinedPending} />
            <Input id="phone" name="phone" type="tel" label={t('staff.modal.phoneLabel')} placeholder={t('staff.modal.phonePlaceholder')} defaultValue={formValues.phone} error={errors.phone} disabled={combinedPending} />
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
              {t('staff.modal.roleLabel')}
            </span>
            <button
              type="button"
              onClick={() => !combinedPending && setIsRolesPanelOpen(!isRolesPanelOpen)}
              className={`h-11 w-full border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none rounded-lg ${
                isRolesPanelOpen || selectedRole
                  ? 'border-brand-emerald bg-brand-emerald/10 text-emerald-800 dark:text-emerald-400 shadow-2xs' 
                  : 'border-border-main/60 bg-bg-main/20 text-brand-emerald hover:text-brand-emerald-hover hover:bg-brand-emerald/5'
              } ${errors.role ? 'border-red-500! text-red-500!' : ''}`}
            >
              <Plus className={`h-4 w-4 transition-transform duration-200 ${isRolesPanelOpen ? 'rotate-45' : ''}`} />
              <span>{selectedRole ? `${t('staff.modal.roleLabel')}: ${displayRoleName}` : t('staff.modal.rolePlaceholder')}</span>
            </button>
            {errors.role && (
              <span className="text-[11px] font-medium text-red-500 mt-1">{errors.role}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 relative shrink-0">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              label={t('staff.modal.passwordLabel')} 
              placeholder={editingMember ? t('staff.modal.passwordPlaceholderEdit') : t('staff.modal.passwordPlaceholderCreate')} 
              error={errors.password} 
              disabled={combinedPending}
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-text-muted hover:text-brand-emerald transition-colors outline-none cursor-pointer flex items-center justify-center" 
                  disabled={combinedPending}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            {editingMember && (
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{t('staff.modal.passwordSet')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border-main pt-4 mt-1 shrink-0">
            <span className="text-sm font-medium text-text-main">{t('staff.modal.statusLabel')}</span>
            <Switch checked={isActiveStatus} onChange={setIsActiveStatus} disabled={combinedPending} />
          </div>

          {validationError && (
            <div className="text-sm text-red-500 font-medium animate-pulse shrink-0">{validationError}</div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-main mt-auto">
            <Button type="button" variant="ghost" className="h-9 text-xs font-semibold" onClick={handleCloseAll} disabled={combinedPending}>
              {t('staff.modal.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="brand" 
              className="px-5 h-9 text-xs font-bold shadow-md bg-brand-emerald hover:bg-brand-emerald-hover text-white" 
              isLoading={combinedPending} 
              disabled={combinedPending}
            >
              {t('staff.modal.save')}
            </Button>
          </div>
        </form>
      </FloatingPanel>

      <FloatingSidePanel
        id="staff-roles-permissions-side-panel"
        isOpen={isOpen && isRolesPanelOpen}
        onClose={() => setIsRolesPanelOpen(false)}
        title={t('staff.modal.rolesPanelBtn')}
        targetSelector=".main-staff-panel"
        targetPanelId="staff-member-floating-panel"
        side="right"
        width={320}
        className="transition-none! animate-in slide-in-from-right duration-200"
      >
        <div className="h-12 px-4 border-b border-solid border-border-main/60 flex items-center justify-between bg-bg-main/30 shrink-0">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">{t('staff.modal.rolesPanelBtn')}</h3>
          <button type="button" onClick={() => setIsRolesPanelOpen(false)} className="text-text-muted hover:text-text-main p-1 rounded-md hover:bg-bg-hover transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5 custom-scrollbar">
          <div className="flex flex-col gap-4">
            <Input
              id="newRoleNameInput"
              label={t('staff.modal.roleLabel')}
              placeholder={t('staff.modal.addRolePlaceholder')}
              value={roleLogic.newRoleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => roleLogic.setNewRoleName(e.target.value)}
              className="h-11 border-border-main"
            />
            
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-1">
                {t('staff.modal.permissionsTitle')}
              </span>
              <div className="grid gap-1 bg-bg-surface dark:bg-bg-element p-2 rounded-lg border border-solid border-border-main/50 max-h-36 overflow-y-auto custom-scrollbar">
                {roleLogic.permissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-3 px-3 py-2 hover:bg-bg-element/20 dark:hover:bg-bg-surface/5 rounded-md cursor-pointer transition-colors duration-150 group">
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={roleLogic.selectedPermissions.includes(perm.id)}
                      onChange={() => roleLogic.togglePermission(perm.id)}
                      className="scale-90"
                    />
                    <span className="text-sm font-medium text-text-main/90 group-hover:text-text-main transition-colors">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="brand"
              onClick={roleLogic.handleAddRoleClick}
              disabled={roleLogic.isCreatingRole || !roleLogic.newRoleName.trim()}
              className="w-full h-11 font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl transition-all shadow-sm"
            >
              {t('staff.modal.addRoleBtn')}
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-solid border-border-main pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-1">{t('staff.modal.existingRoles')}</h4>
            <div className="flex flex-col gap-1.5">
              <div 
                onClick={() => setSelectedRole('STAFF')}
                className={`w-full flex items-center justify-between px-2.5 h-9 rounded-md cursor-pointer transition-all select-none border border-solid ${
                  selectedRole === 'STAFF' || !selectedRole
                    ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-3xs' 
                    : 'border-transparent hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Checkbox id="panel-role-check-default-staff" checked={selectedRole === 'STAFF' || !selectedRole} onChange={() => {}} />
                  <span className={`text-xs font-semibold truncate transition-colors ${selectedRole === 'STAFF' || !selectedRole ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>
                    {t('roles.STAFF')} ({t('marketplace.price.free')})
                  </span>
                </div>
              </div>

              {roles.map((role: CustomStaffRole) => {
                const isCurrentSelected = selectedRole === role.name;
                return (
                  <div 
                    key={role.id} 
                    onClick={() => setSelectedRole(role.name)}
                    className={`w-full flex items-center justify-between px-2.5 h-9 rounded-md cursor-pointer transition-all select-none border border-solid ${
                      isCurrentSelected 
                        ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-3xs' 
                        : 'border-transparent hover:bg-bg-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox id={`panel-role-check-${role.id}`} checked={isCurrentSelected} onChange={() => {}} />
                      <span className={`text-xs font-semibold truncate transition-colors ${isCurrentSelected ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>{role.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setRoleDeleteId(role.id);
                      }}
                      className="text-text-muted hover:text-red-500 p-1 transition-colors rounded cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-bg-main/10 border-t border-solid border-border-main/60 flex justify-end shrink-0 mt-auto">
          <button type="button" onClick={() => setIsRolesPanelOpen(false)} className="h-8 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-md shadow-md transition-colors">
            {t('staff.modal.save')}
          </button>
        </div>
      </FloatingSidePanel>

      <ConfirmModal 
        isOpen={isOpen && !!roleDeleteId} 
        onClose={() => setRoleDeleteId(null)} 
        onConfirm={() => {
          if (roleDeleteId) {
            const roleToDelete = roles.find(r => r.id === roleDeleteId);
            const dummyEvent = {
              preventDefault: () => {},
              stopPropagation: () => {},
            } as unknown as React.MouseEvent;
            roleLogic.handleRemoveRoleClick(dummyEvent, roleDeleteId);
            
            if (roleToDelete && selectedRole === roleToDelete.name) {
              setSelectedRole('STAFF');
            }
            setRoleDeleteId(null);
          }
        }} 
        description={t('confirmModal.defaultDesc')} 
      />
    </>
  );
};