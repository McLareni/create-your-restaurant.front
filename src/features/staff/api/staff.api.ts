// src/features/staff/api/staff.api.ts
import { apiClient } from '@/shared/api/client';
import { CreateStaffDTO, StaffMember, UpdateStaffDTO, CustomStaffRole } from '@/features/staff/types/staff.types';

type BackendStaff = Omit<StaffMember, 'avatarColor'> & { role: string };
type StaffEnvelope = { staff: BackendStaff };

const AVATAR_COLOR_POOL = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-amber-600',
];

const getAvatarColor = (seed: string): string => {
  const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLOR_POOL[hash % AVATAR_COLOR_POOL.length];
};

const toUiStaff = (staff: BackendStaff): StaffMember => ({
  ...staff,
  avatarColor: getAvatarColor(staff.id),
});

const unwrapStaff = (payload: BackendStaff | StaffEnvelope): BackendStaff => 
  'staff' in payload ? payload.staff : payload;

export const staffApi = {
  async getStaff(restaurantId: number): Promise<StaffMember[]> {
    const response = await apiClient.get<BackendStaff[]>(`/restaurants/${restaurantId}/staff`);
    return response.map(toUiStaff);
  },

  async createStaff(restaurantId: number, data: CreateStaffDTO): Promise<StaffMember> {
    const response = await apiClient.post<BackendStaff | StaffEnvelope>(
      `/restaurants/${restaurantId}/staff`,
      data,
    );
    return toUiStaff(unwrapStaff(response));
  },

  // 🛠️ ВИПРАВЛЕНО: Змінено метод з .post на .patch для повної синхронізації з NestJS Controller й REST-конвенцією
  async updateStaff(restaurantId: number, staffId: string, data: UpdateStaffDTO): Promise<StaffMember> {
    const response = await apiClient.patch<BackendStaff | StaffEnvelope>(
      `/restaurants/${restaurantId}/staff/${staffId}`,
      data,
    );
    return toUiStaff(unwrapStaff(response));
  },

  async uploadStaffPhoto(restaurantId: number, staffId: string, photo: File): Promise<StaffMember> {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await apiClient.patch<BackendStaff | StaffEnvelope>(
      `/restaurants/${restaurantId}/staff/${staffId}/photo`,
      formData,
    );
    return toUiStaff(unwrapStaff(response));
  },

  async deleteStaff(restaurantId: number, staffId: string): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/staff/${staffId}`);
  },

  async getRoles(restaurantId: number): Promise<CustomStaffRole[]> {
    return await apiClient.get<CustomStaffRole[]>(`/restaurants/${restaurantId}/staff/roles`);
  },

  async createRole(restaurantId: number, name: string): Promise<CustomStaffRole> {
    return await apiClient.post<CustomStaffRole>(`/restaurants/${restaurantId}/staff/roles`, { name });
  },

  async deleteRole(restaurantId: number, roleId: string): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/staff/roles/${roleId}`);
  }
};