'use client';

import React from 'react';
import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { Plus, Users, Search, RefreshCw } from 'lucide-react';
import { StaffCard } from '@/features/staff/components/staffCard';
import { StaffModalView } from '@/features/staff/components/staffModalView';
import { useStaffList } from '@/features/staff/hooks/useStaffList';
import { HasAccess } from '@/shared/components/hasAccess';
import { PERMISSIONS } from '@/shared/api/menu.constants';
import type { StaffMember } from '@/features/staff/types/staff.types';

export const StaffList = () => {
  const listProps = useStaffList();
  const {
    t, staff, isLoading, localSearch, setLocalSearch, isModalOpen, closeModal,
    editingMember, deleteId, setDeleteId, openCreateModal, openEditModal, confirmDelete, updateStaffStatus,
  } = listProps;

  return (
    <div className="flex h-full flex-col text-text-main">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-5 border-b border-solid border-border-main shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-main">{t('staff.title')}</h2>
          <p className="text-xs md:text-sm text-text-muted mt-1 font-light">{t('staff.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <HasAccess permission={PERMISSIONS.STAFF_CREATE}>
            <Button 
              variant="brand" 
              icon={<Plus className="h-4 w-4" />} 
              onClick={openCreateModal} 
              className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-5 bg-brand-emerald hover:bg-brand-emerald-hover text-white border border-border-main/10 transition-all active:scale-98 flex items-center justify-center gap-1.5 rounded-xl shadow-md font-bold"
            >
              {t('staff.addBtn')}
            </Button>
          </HasAccess>
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
          <EmptyState 
            icon={<Users className="text-text-muted/30" />} 
            title={t('staff.emptyTitle')} 
            description={t('staff.emptyDesc')} 
            action={
              <HasAccess permission={PERMISSIONS.STAFF_CREATE}>
                <Button variant="outline" onClick={openCreateModal}>{t('staff.addBtn')}</Button>
              </HasAccess>
            } 
          />
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
        key={editingMember?.id}
        {...listProps} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('staff.deleteConfirm')} />
    </div>
  );
};