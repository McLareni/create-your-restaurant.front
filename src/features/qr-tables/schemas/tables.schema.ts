import { z } from 'zod';

export const tableSchema = z.object({
  tableNumber: z
    .string()
    .min(1, 'qr.errors.numberRequired')
    .regex(/^\d+$/, 'qr.errors.numberRequired')
    .refine((value) => Number(value) > 0, 'qr.errors.numberRequired'),
  type: z.string().min(1, 'qr.errors.typeRequired'),
  isActive: z.boolean().default(true),
});

export type TableFormValues = z.infer<typeof tableSchema>;