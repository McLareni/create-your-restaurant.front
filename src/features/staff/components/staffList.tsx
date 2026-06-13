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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-5 border-b border-solid border-border-main shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-main">{t('staff.title')}</h2>
          <p className="text-xs md:text-sm text-text-muted mt-1 font-light">{t('staff.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            icon={<ShieldCheck className="h-4 w-4" />} 
            onClick={() => setIsRolesModalOpen(true)} 
            className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-4 border border-border-main bg-bg-surface text-text-main hover:border-brand-emerald hover:text-brand-emerald transition-all shadow-sm rounded-xl font-bold"
          >
            {t('staff.modal.rolesPanelBtn')}
          </Button>
          <Button 
            variant="brand" 
            icon={<Plus className="h-4 w-4" />} 
            onClick={openCreateModal} 
            className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-5 bg-brand-emerald hover:bg-brand-emerald-hover text-white border border-border-main/10 transition-all active:scale-98 flex items-center justify-center gap-1.5 rounded-xl shadow-md font-bold"
          >
            {t('staff.addBtn')}
          </Button>
        </div>
      </div>

      <div className="mb-6 relative w-full max-w-md shrink-0 px-1">
        <span className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-muted/50">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder={t('staff.searchPlaceholder')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 text-sm bg-bg-surface border border-border-main rounded-xl outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/30 transition-colors placeholder:text-text-muted/40 text-text-main shadow-xs"
        />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading && staff.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-medium animate-pulse min-h-[40vh]">
            <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-emerald" />
            {t('actions.loading')}
          </div>
        ) : staff.length === 0 ? (
          <EmptyState icon={<Users className="text-text-muted/30" />} title={t('staff.emptyTitle')} description={t('staff.emptyDesc')} actionLabel={t('staff.addBtn')} onAction={openCreateModal} />
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ scrollbarGutter: 'stable' }}>
            <div className="qr-tables-grid p-2 pt-1 pb-8">
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
        title={t('staff.modal.rolesPanelBtn')}
        className="w-full max-w-xl border border-solid border-border-main shadow-2xl rounded-2xl"
      >
        <div className="flex flex-col gap-8 text-text-main">
          <div className="flex flex-col gap-5">
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted px-1">
                  {t('staff.modal.permissionsTitle')}
                </span>
                <div className="grid gap-1 bg-bg-surface dark:bg-bg-element p-2 rounded-lg border border-solid border-border-main/50">
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
          </div>

          <div className="flex flex-col gap-4 border-t border-solid border-border-main pt-6">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted px-1">{t('staff.modal.existingRoles')}</h4>
            <div className="max-h-52 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
              {roles.length === 0 ? (
                <div className="text-xs text-text-muted text-center py-6 font-light bg-bg-surface dark:bg-bg-element rounded-lg border border-dashed border-border-main">
                  {t('staff.modal.noRoles')}
                </div>
              ) : (
                roles.map((role: CustomStaffRole) => (
                  <div key={role.id} className="flex items-center justify-between h-12 px-4 bg-bg-surface dark:bg-bg-element border border-solid border-border-main rounded-lg hover:border-brand-emerald/30 transition-colors group">
                    <span className="text-sm font-semibold text-text-main">{role.name}</span>
                    <button
                      type="button"
                      onClick={(e) => roleLogic.handleRemoveRoleClick(e, role.id)}
                      className="text-text-muted hover:text-red-500 p-2 rounded-lg hover:bg-red-500/5 transition-all outline-none cursor-pointer border-0 bg-transparent"
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