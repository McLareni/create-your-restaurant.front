import { z } from 'zod';

export const RESERVED_SLUGS = [
  'admin', 'api', 'auth', 'billing', 'dashboard', 'legal', 'login', 
  'marketplace', 'menu', 'support', 'gustio', 'root', 'user', 'users', 
  'settings', 'profile', 'main', 'gastro', 'home'
];

const VALID_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createOrganizationSchema = z.object({
  name: z.string()
    .min(3, 'organization.errors.nameLength')
    .max(100, 'organization.errors.nameLength')
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s’'ʼ«»!-–—.]+$/, 'organization.errors.nameFormat')
    .refine((val) => val.trim().length >= 3, 'organization.errors.nameSpaces'),
    
  slug: z.string()
    .min(2, 'organization.errors.slugLength')
    .max(30, 'organization.errors.slugLength')
    .regex(/^[a-z0-9-]+$/, 'organization.errors.slugFormat')
    .refine((val) => !RESERVED_SLUGS.includes(val.toLowerCase().trim()), {
      message: 'organization.errors.slugReserved',
    }),
    
  type: z.enum(['FAST_FOOD', 'CASUAL_DINING', 'CAFE', 'FINE_DINING', 'BUFFET', 'FOOD_TRUCK'], {
    message: 'organization.errors.required'
  }),
  
  currency: z.enum(['UAH', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'PLN'], {
    message: 'organization.errors.required'
  }),
  
  language: z.string().default('UA'),
  
  city: z.string()
    .max(50, 'organization.errors.cityLength')
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s-]*$/, 'organization.errors.cityFormat')
    .optional()
    .or(z.literal('')),
    
  phone: z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val.trim().length === 0) return true;
      const clean = val.replace(/[\s()+-]/g, '');
      return /^(380\d{9}|48\d{9})$/.test(clean);
    }, 'organization.errors.phoneFormat')
    .transform((val) => {
      if (!val) return '';
      return val.replace(/[\s()+-]/g, '');
    }),
    
  street: z.string().max(100, 'organization.errors.streetLength').optional().or(z.literal('')),
  building: z.string().max(20, 'organization.errors.buildingLength').optional().or(z.literal('')),
  
  workDays: z.array(z.string())
    .min(1, 'organization.errors.workDaysMin')
    .refine((days) => days.every(day => VALID_DAYS.includes(day)), 'organization.errors.required')
    .default(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
    
  workHoursStart: z.string().regex(TIME_REGEX, 'organization.errors.workHoursFormat').default('10:00'),
  workHoursEnd: z.string().regex(TIME_REGEX, 'organization.errors.workHoursFormat').default('22:00'),
  
  instagram: z.string()
    .max(50, 'organization.errors.socialLength')
    .regex(/^[a-zA-Z0-9_.]*$/, 'organization.errors.socialFormat')
    .optional()
    .or(z.literal('')),
    
  facebook: z.string().max(50, 'organization.errors.socialLength').optional().or(z.literal('')),
  
  telegram: z.string()
    .max(50, 'organization.errors.socialLength')
    .regex(/^[a-zA-Z0-9_]*$/, 'organization.errors.socialFormat')
    .optional()
    .or(z.literal('')),
    
  tiktok: z.string().max(50, 'organization.errors.socialLength').optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (!data.workHoursStart || !data.workHoursEnd) return true;
  const [startHour, startMin] = data.workHoursStart.split(':').map(Number);
  const [endHour, endMin] = data.workHoursEnd.split(':').map(Number);
  return (endHour * 60 + endMin) > (startHour * 60 + startMin);
}, {
  message: 'organization.errors.workHoursSequence',
  path: ['workHoursEnd']
});

export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>;