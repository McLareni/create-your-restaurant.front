'use client';

import { useState, useMemo, useOptimistic, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { useStaffMutations } from '@/features/staff/hooks/useStaffMutations';
import toast from 'react-hot-toast';
import type { StaffMember, CreateStaffDTO } from '@/features/staff/types/staff.types';

type OptimisticAction =
  | { type: 'CREATE'; payload: StaffMember }
  | { type: 'UPDATE'; payload: StaffMember }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE_STATUS'; payload: { id: string; isActive: boolean } };

export const useStaffList = () => {
  const { t } = useTranslation();
  const { staff, roles, isLoading } = useStaff();
  const mutations = useStaffMutations();

  const [localSearch, setLocalSearch] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [optimisticStaff, setOptimisticStaff] = useOptimistic<StaffMember[], OptimisticAction>(
    staff,
    (state, action) => {
      switch (action.type) {
        case 'CREATE':
          if (state.some((s) => s.email.toLowerCase() === action.payload.email.toLowerCase())) {
            return state;
          }
          return [...state, action.payload];
        case 'UPDATE':
          return state.map((s) =>
            s.id === action.payload.id || s.email.toLowerCase() === action.payload.email.toLowerCase()
              ? action.payload
              : s
          );
        case 'DELETE':
          return state.filter((s) => s.id !== action.payload);
        case 'TOGGLE_STATUS':
          return state.map((s) =>
            s.id === action.payload.id ? { ...s, isActive: action.payload.isActive } : s
          );
        default:
          return state;
      }
    }
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch]);

  const openCreateModal = () => {
    setEditingMember(null);
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: StaffMember) => {
    setEditingMember(item);
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setGlobalError(null);
  };

  const executeFormSubmit = async (submitData: CreateStaffDTO, photoFile: File | null, previewUrl: string) => {
    setGlobalError(null);
    const temporaryId = Date.now().toString();
    const mockStaffMember: StaffMember = {
      id: editingMember?.id || temporaryId,
      firstName: submitData.firstName,
      lastName: submitData.lastName || '',
      email: submitData.email,
      phone: submitData.phone || '',
      role: submitData.role || 'STAFF',
      isActive: submitData.isActive ?? true,
      photo: previewUrl || null,
      avatarColor: 'bg-brand-copper',
    };

    if (editingMember) {
      setOptimisticStaff({ type: 'UPDATE', payload: mockStaffMember });
    } else {
      setOptimisticStaff({ type: 'CREATE', payload: mockStaffMember });
    }

    try {
      const savedStaff = editingMember
        ? await mutations.updateStaffAsync({ id: editingMember.id, data: submitData })
        : await mutations.createStaffAsync(submitData);

      closeModal();

      if (photoFile && savedStaff?.id) {
        await mutations.uploadStaffPhotoAsync({ staffId: savedStaff.id, file: photoFile });
      }
    } catch (error: unknown) {
      const err = error as Error;
      const backendMessage = err.message || t('auth.errors.defaultError');
      setGlobalError(backendMessage);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      setOptimisticStaff({ type: 'DELETE', payload: deleteId });
      try {
        await mutations.deleteStaffAsync(deleteId);
        setDeleteId(null);
      } catch {
        toast.error(t('auth.errors.defaultError'));
      }
    }
  };

  const toggleStaffStatus = async (id: string, isActive: boolean) => {
    setOptimisticStaff({ type: 'TOGGLE_STATUS', payload: { id, isActive } });
    try {
      await mutations.updateStaffAsync({ id, data: { isActive } });
    } catch {
      toast.error(t('auth.errors.defaultError'));
    }
  };

  const filteredStaff = useMemo(() => {
    const lowerQuery = debouncedSearchQuery.toLowerCase();
    return optimisticStaff.filter((s: StaffMember) =>
      `${s.firstName} ${s.lastName || ''} ${s.email} ${s.role}`.toLowerCase().includes(lowerQuery)
    );
  }, [optimisticStaff, debouncedSearchQuery]);

  return {
    t,
    staff: filteredStaff,
    roles,
    isLoading,
    localSearch,
    setLocalSearch,
    validationError: globalError,
    isModalOpen,
    closeModal,
    editingMember,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    confirmDelete,
    onFormSuccess: executeFormSubmit,
    isFormPending: false,
    updateStaffStatus: toggleStaffStatus,
  };
};