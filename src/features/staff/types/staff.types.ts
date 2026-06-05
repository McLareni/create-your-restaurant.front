import { ChangeEvent, MouseEvent } from 'react';

export interface CustomStaffRole {
  id: string;
  name: string;
}

export interface StaffMember {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatarColor: string;
  password?: string;
}

export interface StaffFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export interface StaffModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: StaffMember | null;
  roles: CustomStaffRole[];
  errors: Record<string, string>;
  validationError: string | null;
  isFormPending: boolean;
  formAction: (formData: FormData) => void | Promise<void>;
  isActiveStatus: boolean;
  setIsActiveStatus: (value: boolean) => void;
  photoPreview: string;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fields: StaffFormFields;
  handleFieldChange: (name: keyof StaffFormFields, value: string) => void;
}

export interface UseStaffRolesReturn {
  newRoleName: string;
  setNewRoleName: (value: string) => void;
  isCreatingRole: boolean;
  handleAddRoleClick: () => Promise<void>;
  handleRemoveRoleClick: (e: MouseEvent, id: string) => Promise<void>;
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

export interface PinPadProps {
  maxLength?: number;
  onConfirm: (pin: string) => void;
  isLoading?: boolean;
}