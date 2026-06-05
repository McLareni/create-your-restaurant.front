// src/features/staff/components/staffList.tsx
'use client';

import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { Plus, Users, Search } from 'lucide-react';
import { StaffCard } from '@/features/staff/components/staffCard';
import { StaffModalView } from '@/features/staff/components/staffModalView';
import { useStaffList } from '@/features/staff/hooks/useStaffList';
import type { StaffMember } from '@/features/staff/types/staff.types';

export const StaffList = () => {
  const props = useStaffList();
  const {
    t,
    staff,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    confirmDelete,
    updateStaff,
  } = props;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('staff.title')}</h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{t('staff.subtitle')}</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
            <input 
              type="text" 
              placeholder={t('staff.searchPlaceholder')} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="h-11 w-full rounded-full border border-brand-gray/30 dark:border-brand-gray/5 bg-white dark:bg-brand-mocha pl-9 pr-4 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper" 
            />
          </div>
          <Button
            variant="brand"
            icon={<Plus className="h-4 w-4" />}
            onClick={openCreateModal}
            className="shrink-0"
            disabled={isLoading}
          >
            {t('staff.addBtn')}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading && staff.length === 0 ? (
          <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
            <div className="h-24 w-full rounded-xl bg-brand-gray/10" />
            <div className="h-24 w-full rounded-xl bg-brand-gray/10" />
          </div>
        ) : staff.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title={t('staff.emptyTitle')}
            description={t('staff.emptyDesc')}
            actionLabel={t('staff.addBtn')}
            onAction={openCreateModal}
          />
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {staff.map((member: StaffMember) => (
                <StaffCard 
                  key={member.id} 
                  member={member} 
                  onEdit={openEditModal} 
                  onDelete={setDeleteId}
                  onStatusChange={(id: string, isActive: boolean) => updateStaff({ id, data: { isActive } })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <StaffModalView {...props} isOpen={isModalOpen} />

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        description={t('staff.deleteConfirm')} 
      />
    </div>
  );
};