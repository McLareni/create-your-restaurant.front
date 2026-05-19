'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Modal, ConfirmModal, Switch, EmptyState } from '@/shared/ui';
import { Plus, Users, Search } from 'lucide-react';
import { useStaff } from '../hooks/useStaff';
import { StaffMember, CreateStaffDTO, StaffRole } from '../types/staff.types';
import { StaffCard } from './staffCard';
import { useCrudModal } from '@/shared/hooks/useCrudModal';

const INITIAL_FORM_DATA: CreateStaffDTO = { firstName: '', lastName: '', email: '', phone: '', role: 'WAITER', isActive: true };

export const StaffList = () => {
  const { t } = useTranslation();
  const { staff, createStaff, updateStaff, deleteStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingMember,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  } = useCrudModal<StaffMember, CreateStaffDTO>({
    initialFormData: INITIAL_FORM_DATA,
    createItem: createStaff,
    updateItem: updateStaff,
    deleteItem: deleteStaff,
  });

  const onSave = () => {
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.role) return;
    handleSave();
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staff;
    const lowerQuery = searchQuery.toLowerCase();
    return staff.filter((s: StaffMember) => 
      `${s.firstName} ${s.lastName || ''} ${s.email}`.toLowerCase().includes(lowerQuery)
    );
  }, [staff, searchQuery]);

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
              className="h-11 w-full rounded-full border border-brand-gray/30 dark:border-brand-gray/50 bg-white dark:bg-brand-mocha pl-9 pr-4 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper" 
            />
          </div>
          <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal} className="shrink-0">
            {t('staff.addBtn')}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {staff.length === 0 ? (
          <EmptyState icon={<Users />} title={t('staff.emptyTitle')} description={t('staff.emptyDesc')} actionLabel={t('staff.addBtn')} onAction={openCreateModal} />
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filteredStaff.map((member: StaffMember) => (
                <StaffCard 
                  key={member.id} 
                  member={member} 
                  onEdit={(item) => openEditModal(item, (i) => ({ ...i }))} 
                  onDelete={setDeleteId}
                  onStatusChange={(id, isActive) => updateStaff({ id, data: { isActive } })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? t('staff.modal.editTitle') : t('staff.modal.createTitle')}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Input id="firstName" label={t('staff.modal.firstNameLabel')} placeholder={t('staff.modal.firstNamePlaceholder')} value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} />
            <Input id="lastName" label={t('staff.modal.lastNameLabel')} placeholder={t('staff.modal.lastNamePlaceholder')} value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} />
          </div>
          <Input id="email" type="email" label={t('staff.modal.emailLabel')} placeholder={t('staff.modal.emailPlaceholder')} value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input id="phone" label={t('staff.modal.phoneLabel')} placeholder={t('staff.modal.phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
            <Select id="role" label={t('staff.modal.roleLabel')} value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as StaffRole }))}>
              <option value="MANAGER">{t('staff.roles.MANAGER')}</option>
              <option value="WAITER">{t('staff.roles.WAITER')}</option>
              <option value="CHEF">{t('staff.roles.CHEF')}</option>
              <option value="BARTENDER">{t('staff.roles.BARTENDER')}</option>
            </Select>
          </div>

          <div className="flex items-center justify-between border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4 mt-2">
            <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('staff.modal.statusLabel')}</span>
            <Switch checked={formData.isActive} onChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('staff.modal.cancel')}</Button>
          <Button variant="brand" onClick={onSave} disabled={!formData.firstName.trim() || !formData.email.trim()}>{t('staff.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('staff.deleteConfirm')} />
    </div>
  );
};