import { Dispatch, SetStateAction, ChangeEvent, MouseEvent } from 'react';

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

export type CreateStaffDTO = Omit<StaffMember, 'id' | 'avatarColor'>;
export type UpdateStaffDTO = Partial<CreateStaffDTO>;

export interface StaffCardProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export interface StaffListViewProps {
  t: (key: string) => string;
  staff: StaffMember[];
  roles: CustomStaffRole[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  validationError: string | null;
  setValidationError: (value: string | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  editingMember: StaffMember | null;
  formData: CreateStaffDTO;
  setFormData: Dispatch<SetStateAction<CreateStaffDTO>>;
  deleteId: string | null;
  setDeleteId: (value: string | null) => void;
  openCreateModal: () => void;
  openEditModal: (member: StaffMember) => void;
  confirmDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  setSelectedPhotoFile: (file: File | null) => void;
  createRole: (name: string) => Promise<any>;
  deleteRole: (id: string) => Promise<any>;
  updateStaff: (params: { id: string; data: any }) => void;
}

export interface StaffModalViewProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: CreateStaffDTO;
  roles: CustomStaffRole[];
  hasPassword?: boolean;
  errors?: Record<string, string>;
  validationError: string | null;
  isLoading?: boolean;
  onSave: () => void;
  t: (key: string) => string;
  newRoleName: string;
  setNewRoleName: (value: string) => void;
  isCreatingRole: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCleanClose: () => void;
  handleAddRole: () => void;
  handleRemoveRole: (e: MouseEvent, id: string, name: string) => void;
  onFieldChange: (field: keyof CreateStaffDTO, value: any) => void;
}

export interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: CreateStaffDTO;
  setFormData: Dispatch<SetStateAction<CreateStaffDTO>>;
  onPhotoFileChange: (file: File | null) => void;
  onSave: () => void;
  roles: CustomStaffRole[];
  onCreateRole: (name: string) => Promise<any>;
  onDeleteRole: (id: string) => Promise<any>;
  hasPassword?: boolean;
  errors?: Record<string, string>;
  validationError: string | null;
  isLoading?: boolean;
}

export interface UseStaffModalProps {
  formData: CreateStaffDTO;
  setFormData: Dispatch<SetStateAction<CreateStaffDTO>>;
  onPhotoFileChange: (file: File | null) => void;
  onCreateRole: (name: string) => Promise<any>;
  onDeleteRole: (id: string) => Promise<any>;
  onClose: () => void;
  isLoading: boolean;
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