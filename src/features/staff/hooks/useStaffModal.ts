import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { CreateStaffDTO, UseStaffModalProps } from '../types/staff.types';
import toast from 'react-hot-toast';

export const useStaffModal = ({
  formData,
  setFormData,
  onPhotoFileChange,
  onCreateRole,
  onDeleteRole,
  onClose,
  isLoading
}: UseStaffModalProps) => {
  const { t } = useTranslation();
  const [newRoleName, setNewRoleName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field: keyof CreateStaffDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading(t('menu.constructor.dishes.notifications.imageUploading'), { id: 'staff-img' });

    if (formData.photo && formData.photo.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photo);
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photo: previewUrl }));
    onPhotoFileChange(file);
    toast.success(t('menu.constructor.dishes.notifications.imageUploadSuccess'), { id: 'staff-img' });
  };

  const handleCleanClose = () => {
    if (formData.photo && formData.photo.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photo);
    }
    setNewRoleName('');
    setShowPassword(false);
    onClose();
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim() || isCreatingRole) return;
    setIsCreatingRole(true);
    try {
      const created = await onCreateRole(newRoleName.trim());
      if (created?.name) {
        setFormData(prev => ({ ...prev, role: created.name }));
      }
      setNewRoleName('');
    } catch {
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleRemoveRole = async (e: MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onDeleteRole(id);
      if (formData.role === name) {
        setFormData(prev => ({ ...prev, role: '' }));
      }
    } catch {}
  };

  useEffect(() => {
    return () => {
      if (formData.photo && formData.photo.startsWith('blob:')) {
        URL.revokeObjectURL(formData.photo);
      }
    };
  }, [formData.photo]);

  return {
    t,
    newRoleName,
    setNewRoleName,
    isCreatingRole,
    showPassword,
    setShowPassword,
    handlePhotoChange,
    handleCleanClose,
    handleAddRole,
    handleRemoveRole,
    onFieldChange: handleFieldChange
  };
};