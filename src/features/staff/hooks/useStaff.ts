import { useQuery } from '@tanstack/react-query';
import { staffApi } from '@/features/staff/api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useStaff = () => {
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

  return {
    staff,
    roles,
    permissions,
    isLoading: isStaffLoading || isRolesLoading || isPermissionsLoading || restaurantId === null,
  };
};