import { useState, useMemo, ChangeEvent, MouseEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useStaff } from '@/features/staff/hooks/useStaff';
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

export const useStaffManagement = () => {
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<CreateStaffDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newRoleName, setNewRoleName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const openCreateModal = () => {
    setSelectedPhotoFile(null);
    setFieldErrors({});
    setValidationError(null);
    setEditingMember(null);
    setFormData(INITIAL_FORM_DATA);
    setNewRoleName('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: StaffMember) => {
    setSelectedPhotoFile(null);
    setFieldErrors({});
    setValidationError(null);
    setEditingMember(item);
    setNewRoleName('');
    setShowPassword(false);
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName || '',
      email: item.email,
      phone: item.phone || '',
      role: item.role,
      isActive: item.isActive,
      photo: item.photo || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleFieldChange = (field: keyof CreateStaffDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.photo && formData.photo.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photo);
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photo: previewUrl }));
    setSelectedPhotoFile(file);
    toast.success(t('staff.modal.imageQueued'));
  };

  const handleCleanClose = () => {
    if (formData.photo && formData.photo.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photo);
    }
    setNewRoleName('');
    setShowPassword(false);
    setIsModalOpen(false);
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim() || isCreatingRole) return;
    setIsCreatingRole(true);
    try {
      const created = await createRole(newRoleName.trim());
      if (created?.name) {
        setFormData(prev => ({ ...prev, role: created.name }));
      }
      setNewRoleName('');
      toast.success(t('staff.notifications.roleCreateSuccess'));
    } catch {
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleRemoveRole = async (e: MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteRole(id);
      if (formData.role === name) {
        setFormData(prev => ({ ...prev, role: '' }));
      }
      toast.success(t('staff.notifications.roleDeleteSuccess'));
    } catch {}
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

      handleCleanClose();
      toast.success(editingMember ? t('staff.notifications.updateSuccess') : t('staff.notifications.createSuccess'));
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || t('auth.errors.defaultError');
      toast.error(backendMessage);
    } finally {
      setIsMutationPending(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStaff(deleteId);
      setDeleteId(null);
      toast.success(t('staff.notifications.deleteSuccess'));
    } catch {
      toast.error(t('auth.errors.defaultError'));
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
    errors: fieldErrors,
    isModalOpen,
    setIsModalOpen,
    editingMember,
    formData,
    setFormData,
    selectedPhotoFile,
    setSelectedPhotoFile,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    confirmDelete,
    onSave,
    newRoleName,
    setNewRoleName,
    isCreatingRole,
    showPassword,
    setShowPassword,
    handlePhotoChange,
    handleCleanClose,
    handleAddRole,
    handleRemoveRole,
    onFieldChange: handleFieldChange,
    updateStaff,
    createRole,
    deleteRole
  };
};