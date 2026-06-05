'use client';

import { useState, useMemo, useActionState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { validateStaffForm } from '@/features/staff/schemas/staff.schema';
import toast from 'react-hot-toast';
import type { StaffMember, StaffFormFields } from '@/features/staff/types/staff.types';

export const useStaffList = () => {
  const { t } = useTranslation();
  const {
    staff,
    roles,
    createStaffAsync,
    updateStaffAsync,
    deleteStaff,
    uploadStaffPhotoAsync,
    updateStaff,
  } = useStaff();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [photoPreview, setPhotoPreview] = useState('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const [fields, setFields] = useState<StaffFormFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleFieldChange = (name: keyof StaffFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const clearPhotoPreviewSafely = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview('');
    setSelectedPhotoFile(null);
  };

  const openCreateModal = () => {
    clearPhotoPreviewSafely();
    setEditingMember(null);
    setIsActiveStatus(true);
    setFields({ firstName: '', lastName: '', email: '', phone: '', role: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: StaffMember) => {
    clearPhotoPreviewSafely();
    setEditingMember(item);
    setIsActiveStatus(item.isActive);
    setPhotoPreview(item.photo || '');
    setFields({
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      email: item.email || '',
      phone: item.phone || '',
      role: item.role || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const [formState, formAction, isFormPending] = useActionState(
    async (prevState: Record<string, string> | null, incomingFormData: FormData) => {
      const rawData = {
        firstName: (incomingFormData.get('firstName') as string) || '',
        lastName: (incomingFormData.get('lastName') as string) || '',
        email: (incomingFormData.get('email') as string) || '',
        phone: (incomingFormData.get('phone') as string) || '',
        role: (incomingFormData.get('role') as string) || '',
        password: (incomingFormData.get('password') as string) || '',
        isActive: isActiveStatus,
      };

      const validation = validateStaffForm(rawData, t);
      if (!validation.success) {
        return validation.errors || {};
      }

      try {
        const { password, ...payload } = validation.data!;
        
        const submitData = {
          ...payload,
          ...(password && password.trim() !== '' ? { password } : {}),
        };

        const savedStaff = editingMember
          ? await updateStaffAsync({ id: editingMember.id, data: submitData })
          : await createStaffAsync(submitData);

        if (selectedPhotoFile && savedStaff?.id) {
          await uploadStaffPhotoAsync({ staffId: savedStaff.id, file: selectedPhotoFile });
        }

        clearPhotoPreviewSafely();
        setIsModalOpen(false);
        toast.success(editingMember ? t('staff.notifications.updateSuccess') : t('staff.notifications.createSuccess'));
        return null;
      } catch (error: unknown) {
        const err = error as Error;
        const backendMessage = err.message || t('auth.errors.defaultError');
        toast.error(backendMessage);
        return { global: backendMessage };
      }
    },
    null
  );

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteStaff(deleteId);
        setDeleteId(null);
        toast.success(t('staff.notifications.deleteSuccess'));
      } catch {}
    }
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
    isLoading: isFormPending,
    searchQuery,
    setSearchQuery,
    validationError: formState?.global || null,
    errors: formState || {},
    isModalOpen,
    setIsModalOpen: (open: boolean) => {
      if (!open) clearPhotoPreviewSafely();
      setIsModalOpen(open);
    },
    editingMember,
    deleteId,
    setDeleteId,
    isActiveStatus,
    setIsActiveStatus,
    photoPreview,
    handlePhotoChange,
    openCreateModal,
    openEditModal,
    confirmDelete,
    formAction,
    isFormPending,
    updateStaff,
    fields,
    handleFieldChange,
  };
};