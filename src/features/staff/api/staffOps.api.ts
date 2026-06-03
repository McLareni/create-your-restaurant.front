import { apiClient } from '@/shared/api/client';
import { ClockInResponse, WaiterZReport, AuthorizeVoidResponse } from '../types/staff.types';

export const staffOpsApi = {
  clockIn: (restaurantId: number, pinCode: string): Promise<ClockInResponse> =>
    apiClient.post<ClockInResponse>(`/restaurants/${restaurantId}/staff-ops/clock-in`, { pinCode }),

  clockOut: (restaurantId: number, pinCode: string): Promise<WaiterZReport> =>
    apiClient.post<WaiterZReport>(`/restaurants/${restaurantId}/staff-ops/clock-out`, { pinCode }),

  authorizeVoid: (restaurantId: number, pinCode: string, orderId: string): Promise<AuthorizeVoidResponse> =>
    apiClient.post<AuthorizeVoidResponse>(`/restaurants/${restaurantId}/staff-ops/authorize-void`, { pinCode, orderId }),
};