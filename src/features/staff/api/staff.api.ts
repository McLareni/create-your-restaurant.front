import { apiClient } from '@/shared/api/client';
import type { 
  StaffMember, 
  CustomStaffRole, 
  CreateStaffDTO, 
  UpdateStaffDTO,
  ClockInResponse,
  WaiterZReport,
  AuthorizeVoidResponse,
  Permission,
  BackendStaff
} from '@/features/staff/types/staff.types';

const toUiStaff = (staff: BackendStaff): StaffMember => ({
  id: String(staff.id),
  firstName: staff.firstName || '',
  lastName: staff.lastName || '',
  email: staff.email,
  phone: staff.phone || '',
  role: staff.role === 'STAFF' ? 'Працівник' : staff.role,
  isActive: staff.isActive,
  photo: staff.photo,
  avatarColor: 'bg-brand-copper',
});

export const staffApi = {
  async getStaff(restaurantId: number): Promise<StaffMember[]> {
    const response = await apiClient.get<BackendStaff[]>(`/restaurants/${restaurantId}/staff`);
    return response.map(toUiStaff);
  },

  async createStaff(restaurantId: number, data: CreateStaffDTO): Promise<StaffMember> {
    const response = await apiClient.post<{ message: string; staff: BackendStaff }>(
      `/restaurants/${restaurantId}/staff`,
      data,
    );
    return toUiStaff(response.staff);
  },

  async updateStaff(restaurantId: number, staffId: string, data: UpdateStaffDTO): Promise<StaffMember> {
    const response = await apiClient.patch<{ message: string; staff: BackendStaff }>(
      `/restaurants/${restaurantId}/staff/${staffId}`,
      data,
    );
    return toUiStaff(response.staff);
  },

  async uploadStaffPhoto(restaurantId: number, staffId: string, photo: File): Promise<StaffMember> {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await apiClient.patch<{ message: string; staff: BackendStaff }>(
      `/restaurants/${restaurantId}/staff/${staffId}/photo`,
      formData,
    );
    return toUiStaff(response.staff);
  },

  async deleteStaff(restaurantId: number, staffId: string): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/staff/${staffId}`);
  },

  async getPermissions(restaurantId: number): Promise<Permission[]> {
    return await apiClient.get<Permission[]>(`/restaurants/${restaurantId}/staff/permissions`);
  },

  async getRoles(restaurantId: number): Promise<CustomStaffRole[]> {
    return await apiClient.get<CustomStaffRole[]>(`/restaurants/${restaurantId}/staff/roles`);
  },

  async createRole(restaurantId: number, name: string, permissions: string[]): Promise<CustomStaffRole> {
    return await apiClient.post<CustomStaffRole>(`/restaurants/${restaurantId}/staff/roles`, { name, permissions });
  },

  async deleteRole(restaurantId: number, roleId: string): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/staff/roles/${roleId}`);
  },

  async clockIn(restaurantId: number, pinCode: string): Promise<ClockInResponse> {
    return apiClient.post<ClockInResponse>(`/restaurants/${restaurantId}/staff-ops/clock-in`, { pinCode });
  },

  async clockOut(restaurantId: number, pinCode: string): Promise<WaiterZReport> {
    return apiClient.post<WaiterZReport>(`/restaurants/${restaurantId}/staff-ops/clock-out`, { pinCode });
  },

  async authorizeVoid(restaurantId: number, pinCode: string, orderId: string): Promise<AuthorizeVoidResponse> {
    return apiClient.post<AuthorizeVoidResponse>(`/restaurants/${restaurantId}/staff-ops/authorize-void`, { pinCode, orderId });
  }
};