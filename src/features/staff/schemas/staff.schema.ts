import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(2, 'staff.errors.firstNameRequired'),
  lastName: z.string().optional().default(''),
  email: z.string().email('staff.errors.emailInvalid').min(1, 'staff.errors.emailRequired'),
  phone: z.string().optional().default(''),
  role: z.string().min(1, 'staff.errors.roleRequired'),
  isActive: z.boolean().default(true),
  photo: z.string().optional().default(''),
  password: z.string().min(4, 'staff.errors.passwordLength').optional().or(z.literal('')),
});

export type StaffFormValues = z.infer<typeof staffSchema>;