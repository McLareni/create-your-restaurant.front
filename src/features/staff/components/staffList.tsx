'use client';

import React, { useState } from 'react';
import { Button, ConfirmModal, EmptyState, FloatingPanel, Input, Checkbox } from '@/shared/ui';
import { Plus, Users, Search, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';
import { StaffCard } from '@/features/staff/components/staffCard';
import { StaffModalView } from '@/features/staff/components/staffModalView';
import { useStaffList } from '@/features/staff/hooks/useStaffList';
import { useStaffRoles } from '@/features/staff/hooks/useStaffRoles';
import type { StaffMember, CustomStaffRole } from '@/features/staff/types/staff.types';

export const StaffList = () => {
  const listProps = useStaffList();
  const {
    t, staff, roles, isLoading, localSearch, setLocalSearch, isModalOpen, setIsModalOpen,
    editingMember, deleteId, setDeleteId, openCreateModal, openEditModal, confirmDelete, updateStaffStatus,
  } = listProps;

  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const roleLogic = useStaffRoles();

  return (
    <div className="flex h-full flex-col text-text-main">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-border-main shrink-0">
        <div>
          <h2 className="text-2xl font-serif font-bold text-text-main">{t('staff.title')}</h2>
          <p className="text-sm text-text-muted mt-1">{t('staff.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<ShieldCheck className="h-4 w-4" />} onClick={() => setIsRolesModalOpen(true)}>
            {t('staff.modal.rolesPanelBtn')}
          </Button>
          <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
            {t('staff.addBtn')}
          </Button>
        </div>
      </div>

      <div className="mb-5 relative w-full max-w-md shrink-0">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder={t('staff.searchPlaceholder')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-sm bg-bg-surface border border-border-main rounded-xl outline-none focus:border-brand-copper transition-colors"
        />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading && staff.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-medium animate-pulse min-h-[40vh]">
            <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-copper" />
            {t('actions.loading')}
          </div>
        ) : staff.length === 0 ? (
          <EmptyState icon={<Users className="text-text-muted/30" />} title={t('staff.emptyTitle')} description={t('staff.emptyDesc')} actionLabel={t('staff.addBtn')} onAction={openCreateModal} />
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="qr-tables-grid">
              {staff.map((member: StaffMember) => (
                <StaffCard 
                  key={member.id} 
                  member={member} 
                  onEdit={openEditModal} 
                  onDelete={setDeleteId}
                  onStatusChange={(id: string, isActive: boolean) => updateStaffStatus(id, isActive)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <StaffModalView 
        key={editingMember?.id || 'create-mode-active-key'}
        {...listProps} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <FloatingPanel
        panelId="staff-roles-permissions-panel"
        isOpen={isRolesModalOpen}
        onClose={() => setIsRolesModalOpen(false)}
        title={t('staff.modal.addRoleLabel')}
        className="w-140 border-brand-copper/20 shadow-2xl"
      >
        <div className="flex flex-col gap-6 text-text-main">
          <div className="bg-bg-main p-4 rounded-xl border border-border-main flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('staff.modal.addRoleLabel')}</h4>
            <div className="flex flex-col gap-4">
              <Input
                id="newRoleNameInput"
                label={t('staff.modal.roleLabel')}
                placeholder={t('staff.modal.addRolePlaceholder')}
                value={roleLogic.newRoleName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => roleLogic.setNewRoleName(e.target.value)}
              />
              
              <div className="flex flex-col gap-2.5 mt-1">
                <span className="text-xs font-semibold text-text-muted">{t('staff.modal.permissionsTitle')}</span>
                <div className="grid gap-2 bg-bg-surface p-3 rounded-lg border border-border-main">
                  {roleLogic.permissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-3 px-1 py-1 hover:bg-bg-hover rounded-md cursor-pointer transition-colors duration-150">
                      <Checkbox
                        id={`perm-${perm.id}`}
                        checked={roleLogic.selectedPermissions.includes(perm.id)}
                        onChange={() => roleLogic.togglePermission(perm.id)}
                      />
                      <span className="text-xs font-medium text-text-main">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="brand"
                onClick={roleLogic.handleAddRoleClick}
                disabled={roleLogic.isCreatingRole || !roleLogic.newRoleName.trim()}
                className="w-full mt-2 h-10 font-bold"
              >
                {t('staff.modal.addRoleBtn')}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('staff.modal.existingRoles')}</h4>
            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
              {roles.length === 0 ? (
                <div className="text-xs text-text-muted text-center py-4 font-medium">{t('staff.modal.noRoles')}</div>
              ) : (
                roles.map((role: CustomStaffRole) => (
                  <div key={role.id} className="flex items-center justify-between h-11 px-4 bg-bg-surface border border-border-main rounded-xl shadow-xs">
                    <span className="text-sm font-semibold text-text-main">{role.name}</span>
                    <button
                      type="button"
                      onClick={(e) => roleLogic.handleRemoveRoleClick(e, role.id)}
                      className="text-text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/5 transition-colors outline-none cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </FloatingPanel>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('staff.deleteConfirm')} />
    </div>
  );
};