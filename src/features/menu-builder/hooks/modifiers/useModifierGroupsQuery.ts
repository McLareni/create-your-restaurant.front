'use client';

import { useQuery } from '@tanstack/react-query';
import { modifiersApi } from '@/features/menu-builder/api/modifiers.api';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import type { ModifierGroup } from '@/features/menu-builder/types/modifiers.types';

export const useModifierGroupsQuery = () => {
  const restaurantId = useActiveRestaurantId();

  return useQuery<ModifierGroup[]>({
    queryKey: QUERY_KEYS.modifierGroups(restaurantId),
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return modifiersApi.getGroups(restaurantId);
    },
    enabled: !!restaurantId,
  });
};