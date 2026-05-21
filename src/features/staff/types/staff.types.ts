export type StaffRole = 'MANAGER' | 'WAITER' | 'CHEF' | 'BARTENDER';

export interface StaffMember {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  avatarColor: string; 
}

export type CreateStaffDTO = Omit<StaffMember, 'id' | 'avatarColor'>;
export type UpdateStaffDTO = Partial<CreateStaffDTO>;