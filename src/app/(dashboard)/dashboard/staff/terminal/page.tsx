'use client';
import { StaffShiftManager } from '@/features/staff/components/staffShiftManager';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
export default function StaffTerminalPage() {
  const restaurantId = useActiveRestaurantId();
  if (!restaurantId) return null;
  return <StaffShiftManager restaurantId={restaurantId} />;
}