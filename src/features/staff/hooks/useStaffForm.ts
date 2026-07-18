'use client';

import { useActionState, useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { validateStaffForm } from '@/features/staff/schemas/staff.schema';
import type { StaffMember, CreateStaffDTO, FormActionState, UseStaffFormReturn } from '@/features/staff/types/staff.types';

export const useStaffForm = (
  editingMember: StaffMember | null,
  onSuccess: (submitData: CreateStaffDTO, photoFile: File | null, previewUrl: string) => void | Promise<void>
): UseStaffFormReturn => {
  const { t } = useTranslation();
  const [isActiveStatus, setIsActiveStatus] = useState(() => editingMember ? editingMember.isActive : true);
  const [selectedRole, setSelectedRole] = useState(() => editingMember ? editingMember.role : 'STAFF');
  const [photoPreview, setPhotoPreview] = useState(() => editingMember ? editingMember.photo || '' : '');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const initialState: FormActionState = {
    errors: {},
    values: {
      firstName: editingMember?.firstName || '',
      lastName: editingMember?.lastName || '',
      email: editingMember?.email || '',
      phone: editingMember?.phone || '',
      password: '',
    }
  };

  const [state, formAction, isPending] = useActionState(
    async (_prevState: FormActionState, formData: FormData): Promise<FormActionState> => {
      const currentValues = {
        firstName: (formData.get('firstName') as string) || '',
        lastName: (formData.get('lastName') as string) || '',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        password: (formData.get('password') as string) || '',
      };

      const validation = validateStaffForm({
        ...currentValues,
        role: selectedRole,
        isActive: isActiveStatus
      }, t);

      if (!validation.success) {
        return {
          errors: validation.errors || {},
          values: currentValues
        };
      }

      try {
        const { password, ...payload } = validation.data!;
        const submitData: CreateStaffDTO = {
          ...payload,
          ...(password && password.trim() !== '' ? { password } : {}),
        };

        await onSuccess(submitData, selectedPhotoFile, photoPreview);

        return {
          errors: {},
          values: { firstName: '', lastName: '', email: '', phone: '', password: '' }
        };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
          errors: { global: errorMessage },
          values: currentValues
        };
      }
    },
    initialState
  );

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(file));
    setSelectedPhotoFile(file);
  };

  return {
    selectedRole,
    setSelectedRole,
    isActiveStatus,
    setIsActiveStatus,
    photoPreview,
    handlePhotoChange,
    errors: state.errors,
    formValues: state.values,
    formAction,
    isPending,
  };
};