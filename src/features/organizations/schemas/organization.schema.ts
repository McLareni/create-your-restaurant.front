import { z } from 'zod';

const RESERVED_SLUGS = ['admin', 'api', 'gastro', 'www', 'dashboard', 'auth', 'staff', 'support', 'billing', 'app'];

export const createOrganizationSchema = z.object({
  name: z.string().min(3, 'organization.errors.nameLength'),
  slug: z.string()
    .min(3, 'organization.errors.slugFormat')
    .regex(/^[a-z0-9-]+$/, 'organization.errors.slugFormat')
    .refine((val) => !RESERVED_SLUGS.includes(val), 'organization.errors.slugReserved'),
  
  type: z.enum(['FAST_FOOD', 'CASUAL_DINING', 'FINE_DINING', 'CAFE', 'BUFFET', 'FOOD_TRUCK'], { message: 'organization.errors.required' }),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'PLN', 'UAH'], { message: 'organization.errors.required' }),
  language: z.enum(['EN', 'FR', 'ES', 'DE', 'IT', 'RU', 'CN', 'JP', 'PL', 'UA'], { message: 'organization.errors.required' }),
  
  city: z.string()
    .regex(/^[^!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/]+$/, 'organization.errors.cityFormat')
    .min(2, 'organization.errors.cityLength')
    .max(50, 'organization.errors.cityLength')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^\+?[1-9]\d{6,14}$/, 'organization.errors.phoneFormat')
    .optional()
    .or(z.literal('')),
});

export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>;