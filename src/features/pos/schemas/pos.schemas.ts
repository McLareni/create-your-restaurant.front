import { z } from 'zod';

export const posConnectionSchema = z.object({
  apiKey: z
    .string()
    .trim()
    .min(16, { message: 'pos.errors.tokenTooShort' })
    .max(128, { message: 'pos.errors.tokenTooLong' })
    .regex(/^[a-zA-Z0-9_\-]+$/, { message: 'pos.errors.invalidTokenFormat' }),
});