// src/features/staff/hooks/useStaff.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/features/staff/api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { StaffMember, CustomStaffRole, CreateStaffDTO, UpdateStaffDTO } from '@/features/staff/types/staff.types';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurantId = useRestaurantStore((state) => state.activeRestaurant?.id);
  const restaurantId = activeRestaurantId ? Number(activeRestaurantId) : null;

  const { data: staff = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['staffList', restaurantId],
    queryFn: () => staffApi.getStaff(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: roles = [], isLoading: isRolesLoading } = useQuery({
    queryKey: ['staffRoles', restaurantId],
    queryFn: () => staffApi.getRoles(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: permissions = [], isLoading: isPermissionsLoading } = useQuery({
    queryKey: ['staffPermissions', restaurantId],
    queryFn: () => staffApi.getPermissions(restaurantId!),
    enabled: !!restaurantId,
  });

  const createStaffMutation = useMutation<StaffMember, Error, CreateStaffDTO>({
    mutationFn: (data: CreateStaffDTO) => staffApi.createStaff(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.createSuccess'));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || t('staff.notifications.createError'));
    }
  });

  const updateStaffMutation = useMutation<StaffMember, Error, { id: string; data: UpdateStaffDTO }>({
    mutationFn: ({ id, data }) => staffApi.updateStaff(restaurantId!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.updateSuccess'));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || t('staff.notifications.updateError'));
    }
  });

  const uploadStaffPhotoMutation = useMutation<StaffMember, Error, { staffId: string; file: File }>({
    mutationFn: ({ staffId, file }) => staffPhotoUpload(restaurantId!, staffId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  const staffPhotoUpload = async (resId: number, stId: string, file: File) => {
    return staffApi.uploadStaffPhoto(resId, stId, file);
  };

  const deleteStaffMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => staffApi.deleteStaff(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  const createRoleMutation = useMutation<CustomStaffRole, Error, { name: string; permissions: string[] }>({
    mutationFn: ({ name, permissions }) => staffApi.createRole(restaurantId!, name, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
    }
  });

  const deleteRoleMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => staffApi.deleteRole(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  return {
    staff,
    roles,
    permissions,
    isLoading: isStaffLoading || isRolesLoading || isPermissionsLoading || restaurantId === null,
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    updateStaff: updateStaffMutation.mutate,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    deleteStaff: deleteStaffMutation.mutate,
    uploadStaffPhoto: uploadStaffPhotoMutation.mutate,
    uploadStaffPhotoAsync: uploadStaffPhotoMutation.mutateAsync,
    createRole: createRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
  };
};