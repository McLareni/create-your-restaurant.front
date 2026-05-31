import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staffList', restaurantId],
    queryFn: () => staffApi.getStaff(restaurantId),
    enabled: !!restaurantId,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['staffRoles', restaurantId],
    queryFn: () => staffApi.getRoles(restaurantId),
    enabled: !!restaurantId,
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: any) => staffApi.createStaff(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.createSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.createError'));
    }
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => staffApi.updateStaff(restaurantId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.updateSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.updateError'));
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(restaurantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.deleteSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.deleteError'));
    }
  });

  const uploadStaffPhotoMutation = useMutation({
    mutationFn: ({ staffId, file }: { staffId: string; file: File }) =>
      staffApi.uploadStaffPhoto(restaurantId, staffId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.updateError'));
    }
  });

  const createRoleMutation = useMutation({
    mutationFn: (name: string) => staffApi.createRole(restaurantId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
      toast.success(t('staff.notifications.roleCreateSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.roleCreateError'));
    }
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => staffApi.deleteRole(restaurantId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
      toast.success(t('staff.notifications.roleDeleteSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.roleDeleteError'));
    }
  });

  return {
    staff,
    roles,
    isLoading,
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