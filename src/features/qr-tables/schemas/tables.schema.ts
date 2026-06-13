import { z } from 'zod';

export const tableSchema = z.object({
  tableNumber: z
    .string()
    .min(1, 'qr.errors.numberRequired')
    .max(10, 'qr.errors.numberTooLong')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'qr.errors.numberNumeric',
    }),
  type: z
    .string()
    .min(1, 'qr.errors.typeRequired')
    .max(60, 'qr.errors.typeTooLong'),
  isActive: z.boolean().default(true),
});