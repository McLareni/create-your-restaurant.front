import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { staffSchema } from '@/features/staff/schemas/staff.schema';
import { StaffMember, CreateStaffDTO } from '@/features/staff/types/staff.types';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA: CreateStaffDTO = { firstName: '', lastName: '', email: '', phone: '', role: '', isActive: true, photo: '', password: '' };

export const useStaffList = () => {
  const { t } = useTranslation();
  const {
    staff,
    roles,
    createStaffAsync,
    updateStaff,
    updateStaffAsync,
    deleteStaff,
    uploadStaffPhotoAsync,
    createRole,
    deleteRole,
    isLoading,
  } = useStaff();

  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingMember,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal: coreOpenCreateModal,
    openEditModal: coreOpenEditModal,
    confirmDelete,
  } = useCrudModal<StaffMember, CreateStaffDTO>({
    initialFormData: INITIAL_FORM_DATA,
    createItem: (data) => {
      void createStaffAsync(data);
    },
    updateItem: updateStaff,
    deleteItem: deleteStaff,
  });

  const openCreateModal = () => {
    setSelectedPhotoFile(null);
    coreOpenCreateModal();
  };

  const openEditModal = (item: StaffMember) => {
    setSelectedPhotoFile(null);
    coreOpenEditModal(item, (i) => ({
      firstName: i.firstName,
      lastName: i.lastName,
      email: i.email,
      phone: i.phone,
      role: i.role,
      isActive: i.isActive,
      photo: i.photo || '',
      password: '',
    }));
  };

  const onSave = async () => {
    setValidationError(null);
    const validation = staffSchema.safeParse(formData);
    
    if (!validation.success) {
      setValidationError(t(validation.error.issues[0].message));
      return;
    }

    try {
      const { photo, ...payload } = validation.data;
      void photo;

      const savedStaff = editingMember
        ? await updateStaffAsync({ id: editingMember.id, data: payload })
        : await createStaffAsync(payload);

      if (selectedPhotoFile && savedStaff?.id) {
        await uploadStaffPhotoAsync({ staffId: savedStaff.id, file: selectedPhotoFile });
      }

      setSelectedPhotoFile(null);
      setIsModalOpen(false);
      setValidationError(null);
      toast.success(editingMember ? t('staff.modal.updateSuccess' as any) || 'Дані працівника оновлено' : t('staff.modal.createSuccess' as any) || 'Працівника успішно додано');
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || t('auth.errors.defaultError');
      toast.error(backendMessage);
    }
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staff;
    const lowerQuery = searchQuery.toLowerCase();
    return staff.filter((s: StaffMember) => 
      `${s.firstName} ${s.lastName || ''} ${s.email}`.toLowerCase().includes(lowerQuery)
    );
  }, [staff, searchQuery]);

  return {
    t,
    staff: filteredStaff,
    roles,
    isLoading,
    searchQuery,
    setSearchQuery,
    validationError,
    setValidationError,
    isModalOpen,
    setIsModalOpen,
    editingMember,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    confirmDelete,
    onSave,
    setSelectedPhotoFile,
    createRole,
    deleteRole,
    updateStaff,
  };
};