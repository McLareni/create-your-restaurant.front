'use client';

import { Button, ConfirmModal, EmptyState } from '@/shared/ui';
import { Plus, Users, Search } from 'lucide-react';
import { StaffCard } from './staffCard';
import { StaffModal } from './staffModal';
import { useStaffManagement } from '../hooks/useStaffManagement';

export const StaffListView = () => {
  const state = useStaffManagement();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{state.t('staff.title')}</h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{state.t('staff.subtitle')}</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
            <input 
              type="text" 
              placeholder={state.t('staff.searchPlaceholder')} 
              value={state.searchQuery} 
              onChange={(e) => state.setSearchQuery(e.target.value)} 
              className="h-11 w-full rounded-full border border-brand-gray/30 dark:border-brand-gray/5 bg-white dark:bg-brand-mocha pl-9 pr-4 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper" 
            />
          </div>
          <Button
            variant="brand"
            icon={<Plus className="h-4 w-4" />}
            onClick={state.openCreateModal}
            className="shrink-0"
            disabled={state.isLoading}
          >
            {state.t('staff.addBtn')}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {state.isLoading && state.staff.length === 0 ? (
          <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
            <div className="h-24 w-full rounded-xl bg-brand-gray/10"></div>
            <div className="h-24 w-full rounded-xl bg-brand-gray/10"></div>
          </div>
        ) : state.staff.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title={state.t('staff.emptyTitle')}
            description={state.t('staff.emptyDesc')}
            actionLabel={state.t('staff.addBtn')}
            onAction={state.openCreateModal}
          />
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {state.staff.map((member) => (
                <StaffCard 
                  key={member.id} 
                  member={member} 
                  onEdit={state.openEditModal} 
                  onDelete={state.setDeleteId}
                  onStatusChange={(id: string, isActive: boolean) => state.updateStaff({ id, data: { isActive } })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <StaffModal 
        isOpen={state.isModalOpen} 
        onClose={state.handleCleanClose} 
        isEditing={!!state.editingMember} 
        formData={state.formData} 
        setFormData={state.setFormData} 
        onPhotoFileChange={state.setSelectedPhotoFile}
        onSave={state.onSave} 
        roles={state.roles}
        onCreateRole={state.createRole}
        onDeleteRole={state.deleteRole}
        hasPassword={!!state.editingMember?.password}
        validationError={state.validationError} 
        isLoading={state.isLoading}
        errors={state.errors}
      />

      <ConfirmModal 
        isOpen={!!state.deleteId} 
        onClose={() => state.setDeleteId(null)} 
        onConfirm={state.confirmDelete} 
        description={state.t('staff.deleteConfirm')} 
      />
    </div>
  );
};