export type UserProfileRole = 'OWNER' | 'STAFF' | 'CUSTOMER';

export interface UserProfileDto {
  id: string | number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  photo?: string | null;
  role: UserProfileRole;
  phone?: string | null;
}