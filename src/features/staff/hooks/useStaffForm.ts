'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { validateStaffForm } from '@/features/staff/schemas/staff.schema';
import toast from 'react-hot-toast';
import type { StaffMember, CustomStaffRole, CreateStaffDTO, UseStaffFormReturn } from '@/features/staff/types/staff.types';

export const useStaffForm = (
  roles: CustomStaffRole[],
  editingMember: StaffMember | null,
  onSuccess: (submitData: CreateStaffDTO, photoFile: File | null, previewUrl: string) => void
): UseStaffFormReturn => {
  const { t } = useTranslation();
  
  const [prevMember, setPrevMember] = useState<StaffMember | null>(editingMember);
  const [isActiveStatus, setIsActiveStatus] = useState(() => editingMember ? editingMember.isActive : true);
  const [photoPreview, setPhotoPreview] = useState(() => editingMember ? editingMember.photo || '' : '');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [fields, setFields] = useState<Record<string, string>>({
    firstName: editingMember?.firstName || '',
    lastName: editingMember?.lastName || '',
    email: editingMember?.email || '',
    phone: editingMember?.phone || '',
    role: roles.some((r) => r.name === editingMember?.role) ? editingMember?.role || '' : '',
    password: '',
  });

  if (editingMember !== prevMember) {
    setPrevMember(editingMember);
    setIsActiveStatus(editingMember ? editingMember.isActive : true);
    setPhotoPreview(editingMember ? editingMember.photo || '' : '');
    setSelectedPhotoFile(null);
    setValidationErrors({});
    setFields({
      firstName: editingMember?.firstName || '',
      lastName: editingMember?.lastName || '',
      email: editingMember?.email || '',
      phone: editingMember?.phone || '',
      role: roles.some((r) => r.name === editingMember?.role) ? editingMember?.role || '' : '',
      password: '',
    });
  }

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleFieldChange = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(file));
    setSelectedPhotoFile(file);
    toast.success(t('staff.modal.imageQueued'));
  };

  const handleFormSubmit = (formData: FormData) => {
    setValidationErrors({});
    const selectedRoleName = (formData.get('role') as string) || '';
    
    const rawData = {
      firstName: (formData.get('firstName') as string) || '',
      lastName: (formData.get('lastName') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      role: selectedRoleName,
      password: (formData.get('password') as string) || '',
      isActive: isActiveStatus,
    };

    const validation = validateStaffForm(rawData, t);
    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    const { password, ...payload } = validation.data!;
    const submitData: CreateStaffDTO = {
      ...payload,
      ...(password && password.trim() !== '' ? { password } : {}),
    };

    onSuccess(submitData, selectedPhotoFile, photoPreview);
  };

  return {
    fields,
    handleFieldChange,
    isActiveStatus,
    setIsActiveStatus,
    photoPreview,
    handlePhotoChange,
    errors: validationErrors,
    formAction: handleFormSubmit,
  };
};