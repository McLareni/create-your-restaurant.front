import { ChangeEvent } from 'react';

export type ShiftMode = 'SELECT' | 'IN' | 'OUT';

export interface Permission {
  id: string;
  label: string;
}

export interface CreateStaffDTO {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  photo?: string;
  password?: string;
}

export type UpdateStaffDTO = Partial<CreateStaffDTO>;

export interface CustomStaffRole {
  id: string;
  restaurantId: number;
  name: string;
  createdAt: string;
}

export interface BackendStaff {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: 'OWNER' | 'STAFF' | 'CUSTOMER';
  isActive: boolean;
  photo: string | null;
  pinCode: string | null;
}

export interface StaffMember {
  id: string;
  photo?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatarColor: string;
}

export interface StaffCardProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export interface StaffModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: StaffMember | null;
  roles: CustomStaffRole[];
  validationError: string | null;
  isFormPending: boolean;
  onFormSuccess: (submitData: CreateStaffDTO, photoFile: File | null, previewUrl: string) => void;
}

export interface UseStaffFormReturn {
  fields: Record<string, string>;
  handleFieldChange: (name: string, value: string) => void;
  isActiveStatus: boolean;
  setIsActiveStatus: (value: boolean) => void;
  photoPreview: string;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  formAction: (formData: FormData) => void;
}

export interface ClockInResponse {
  status: string;
  firstName: string;
}

export interface WaiterZReport {
  waiterId: number;
  waiterName: string;
  shiftStart: string;
  shiftEnd: string;
  totalHours: number;
  totalOrdersClosed: number;
  totalSalesVolume: number;
  baseHourlyEarnings: number;
  percentageEarnings: number;
  finalTotalEarnings: number;
}

export interface AuthorizeVoidResponse {
  success: boolean;
  voidedBy: string;
}

export interface StaffShiftManagerProps {
  restaurantId: number;
}

export interface ApiErrorResponse {
  message?: string;
}

export interface PinPadProps {
  onConfirm: (pin: string) => void;
  isLoading: boolean;
}