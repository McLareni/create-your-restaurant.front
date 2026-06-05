import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z
    .string()
    .min(1, 'staff.errors.firstNameRequired')
    .max(50, 'staff.errors.firstNameTooLong')
    .regex(
      /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'’-]+$/,
      "Ім'я може містити лише літери, пробіли, дефіси та апострофи",
    ),
  lastName: z
    .string()
    .max(50, 'staff.errors.lastNameTooLong')
    .refine(
      (val) => !val || /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'’-]+$/.test(val),
      "Прізвище може містити лише літери, пробіли, дефіси та апострофи",
    )
    .optional()
    .or(z.literal(''))
    .default(''),
  email: z
    .string()
    .email('staff.errors.emailInvalid')
    .min(1, 'staff.errors.emailRequired')
    .max(100, 'staff.errors.emailTooLong')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email не може містити кириличні літери',
    ),
  phone: z
    .string()
    .max(30, 'Номер телефону занадто довгий')
    .refine(
      (val) => !val || /^\+?[0-9\s()-]{7,20}$/.test(val),
      'Некоректний формат телефону (дозволено цифри, дужки, дефіси, пробіли)',
    )
    .optional()
    .or(z.literal(''))
    .default(''),
  role: z
    .string()
    .min(1, 'staff.errors.roleRequired')
    .max(50, 'staff.errors.roleTooLong')
    .regex(
      /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s-]+$/,
      'Назва посади може містити лише літери та пробіли',
    ),
  isActive: z.boolean().default(true),
  photo: z.string().optional().default(''),
  password: z
    .string()
    .max(32, 'staff.errors.passwordTooLong')
    .refine((val) => !val || val.length >= 4, 'staff.errors.passwordLength')
    .refine(
      (val) => !val || /^[^\u0400-\u04FF]+$/.test(val),
      'Пароль не може містити кириличні літери',
    )
    .optional()
    .or(z.literal('')),
});

export const validateStaffForm = (
  rawData: unknown,
  t: (key: string) => string,
) => {
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