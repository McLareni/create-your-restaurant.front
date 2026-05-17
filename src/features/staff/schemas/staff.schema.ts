import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(2, 'staff.errors.firstNameRequired'),
  lastName: z.string().optional().default(''),
  email: z.string().email('staff.errors.emailInvalid').min(1, 'staff.errors.emailRequired'),
  phone: z.string().optional().default(''),
  role: z.enum(['MANAGER', 'WAITER', 'CHEF', 'BARTENDER'], { 
    message: 'staff.errors.roleRequired' 
  }),
  isActive: z.boolean().default(true),
});

export type StaffFormValues = z.infer<typeof staffSchema>;