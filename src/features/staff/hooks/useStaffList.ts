import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { staffSchema } from '@/features/staff/schemas/staff.schema';
import { StaffMember, CreateStaffDTO, UpdateStaffDTO } from '../types/staff.types';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA: CreateStaffDTO = { 
  firstName: '', 
  lastName: '', 
  email: '', 
  phone: '', 
  role: '', 
  isActive: true, 
  photo: '', 
  password: '' 
};

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
    isLoading: isQueriesLoading,
  } = useStaff();

  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [isMutationPending, setIsMutationPending] = useState(false);

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
    createItem: async () => {},
    updateItem: () => {},
    deleteItem: deleteStaff as any,
  });

  const openCreateModal = () => {
    setSelectedPhotoFile(null);
    setFieldErrors({});
    setValidationError(null);
    coreOpenCreateModal();
  };

  const openEditModal = (item: StaffMember) => {
    setSelectedPhotoFile(null);
    setFieldErrors({});
    setValidationError(null);
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
    if (isMutationPending) return;
    setValidationError(null);
    setFieldErrors({});
    
    const validation = staffSchema.safeParse(formData);
    
    if (!validation.success) {
      const errorsMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errorsMap[path] = t(issue.message);
      });
      setFieldErrors(errorsMap);
      setValidationError(t(validation.error.issues[0].message));
      return;
    }

    setIsMutationPending(true);
    try {
      const { photo, password, ...payload } = validation.data;
      void photo;

      const submitData: UpdateStaffDTO = {
        ...payload,
        ...(password && password.trim() !== '' ? { password } : {})
      };

      const savedStaff = editingMember
        ? await updateStaffAsync({ id: editingMember.id, data: submitData })
        : await createStaffAsync(submitData as CreateStaffDTO);

      if (selectedPhotoFile && savedStaff?.id) {
        await uploadStaffPhotoAsync({ staffId: savedStaff.id, file: selectedPhotoFile });
      }

      setSelectedPhotoFile(null);
      setIsModalOpen(false);
      setValidationError(null);
      setFieldErrors({});
      toast.success(editingMember ? t('staff.notifications.updateSuccess') : t('staff.notifications.createSuccess'));
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || t('auth.errors.defaultError');
      toast.error(backendMessage);
    } finally {
      setIsMutationPending(false);
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
    isLoading: isQueriesLoading || isMutationPending,
    searchQuery,
    setSearchQuery,
    validationError,
    setValidationError,
    errors: fieldErrors,
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