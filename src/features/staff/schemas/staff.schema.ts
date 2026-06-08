import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z
    .string()
    .min(1, 'staff.errors.firstNameRequired')
    .max(50, 'staff.errors.firstNameTooLong'),
  lastName: z
    .string()
    .max(50, 'staff.errors.lastNameTooLong')
    .optional()
    .or(z.literal(''))
    .default(''),
  email: z
    .string()
    .email('staff.errors.emailInvalid')
    .min(1, 'staff.errors.emailRequired')
    .max(100, 'staff.errors.emailTooLong'),
  phone: z
    .string()
    .max(30, 'staff.errors.phoneTooLong')
    .optional()
    .or(z.literal(''))
    .default(''),
  role: z
    .string()
    .min(1, 'staff.errors.roleRequired')
    .max(50, 'staff.errors.roleTooLong'),
  isActive: z.boolean().default(true),
  photo: z.string().optional().default(''),
  password: z
    .string()
    .max(32, 'staff.errors.passwordTooLong')
    .refine((val) => !val || val.trim().length >= 4, 'staff.errors.passwordLength')
    .optional()
    .or(z.literal('')),
});

export const validateStaffForm = (rawData: unknown, t: (key: string) => string) => {
  const validation = staffSchema.safeParse(rawData);
  if (!validation.success) {
    const errorsMap: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      errorsMap[path] = t(issue.message);
    });
    return { success: false, errors: errorsMap, data: null };
  }
  return { success: true, errors: null, data: validation.data };
};