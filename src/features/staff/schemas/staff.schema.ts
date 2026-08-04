import { z } from 'zod';
import { emailPrimitiveSchema, phonePrimitiveSchema, namePrimitiveSchema } from '@/shared/domain/validation/common.schema';

export const staffSchema = z.object({
  firstName: namePrimitiveSchema,
  lastName: z
    .string()
    .min(1, 'staff.errors.lastNameRequired')
    .max(50, 'staff.errors.lastNameTooLong')
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'’-]+$/, 'staff.errors.lastNameInvalid'),
  email: emailPrimitiveSchema,
  phone: phonePrimitiveSchema,
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