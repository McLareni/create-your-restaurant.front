'use client';

import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/features/staff/api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import toast from 'react-hot-toast';
import type { CreateStaffDTO, UpdateStaffDTO, AuthorizeVoidResponse, CustomStaffRole, StaffMember } from '@/features/staff/types/staff.types';

export const useStaffMutations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurantId = useRestaurantStore((state) => state.activeRestaurant?.id);
  const restaurantId = activeRestaurantId ? Number(activeRestaurantId) : null;

  const createStaffMutation = useMutation<StaffMember, Error, CreateStaffDTO>({
    mutationFn: (data) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.createStaff(restaurantId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
      toast.success(t('staff.notifications.createSuccess'));
    },
    onError: (err) => {
      toast.error(err.message || t('staff.notifications.createError'));
    }
  });

  const updateStaffMutation = useMutation<StaffMember, Error, { id: string; data: UpdateStaffDTO }>({
    mutationFn: ({ id, data }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.updateStaff(restaurantId, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
      toast.success(t('staff.notifications.updateSuccess'));
    },
    onError: (err) => {
      toast.error(err.message || t('staff.notifications.updateError'));
    }
  });

  const uploadStaffPhotoMutation = useMutation<StaffMember, Error, { staffId: string; file: File }>({
    mutationFn: ({ staffId, file }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.uploadStaffPhoto(restaurantId, staffId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
    }
  });

  const deleteStaffMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.deleteStaff(restaurantId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
      toast.success(t('staff.notifications.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    }
  });

  const createRoleMutation = useMutation<CustomStaffRole, Error, { name: string; permissions: string[] }>({
    mutationFn: ({ name, permissions }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.createRole(restaurantId, name, permissions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffRoles(restaurantId) });
      toast.success(t('staff.notifications.roleCreateSuccess'));
    },
    onError: () => {
      toast.error(t('staff.notifications.roleCreateError'));
    }
  });

  const updateRoleMutation = useMutation<CustomStaffRole, Error, { id: string; permissions: string[] }>({
    mutationFn: ({ id, permissions }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.updateRole(restaurantId, id, permissions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffRoles(restaurantId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
      toast.success(t('staff.notifications.updateSuccess'));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    }
  });

  const deleteRoleMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.deleteRole(restaurantId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffRoles(restaurantId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList(restaurantId) });
      toast.success(t('staff.notifications.roleDeleteSuccess'));
    },
    onError: () => {
      toast.error(t('staff.notifications.roleDeleteError'));
    }
  });

  const authorizeVoidMutation = useMutation<AuthorizeVoidResponse, Error, { pinCode: string; orderId: string }>({
    mutationFn: ({ pinCode, orderId }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.authorizeVoid(restaurantId, pinCode, orderId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders(restaurantId) });
      toast.success(`${t('staff.ops.voidSuccess')} ${data.voidedBy}`);
    },
    onError: () => {
      toast.error(t('staff.ops.voidError'));
    }
  });

  return useMemo(() => ({
    createStaffAsync: createStaffMutation.mutateAsync,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    uploadStaffPhotoAsync: uploadStaffPhotoMutation.mutateAsync,
    deleteStaffAsync: deleteStaffMutation.mutateAsync,
    createRoleAsync: createRoleMutation.mutateAsync,
    updateRoleAsync: updateRoleMutation.mutateAsync,
    deleteRoleAsync: deleteRoleMutation.mutateAsync,
    authorizeVoidAsync: authorizeVoidMutation.mutateAsync,
    isAuthorizingVoid: authorizeVoidMutation.isPending,
  }), [
    createStaffMutation.mutateAsync,
    updateStaffMutation.mutateAsync,
    uploadStaffPhotoMutation.mutateAsync,
    deleteStaffMutation.mutateAsync,
    createRoleMutation.mutateAsync,
    updateRoleMutation.mutateAsync,
    deleteRoleMutation.mutateAsync,
    authorizeVoidMutation.mutateAsync,
    authorizeVoidMutation.isPending,
  ]);
};