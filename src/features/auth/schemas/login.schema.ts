import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid')
    .regex(/^[^\u0400-\u04FF]+$/, 'auth.errors.emailCyrillic'),
});

export const verifySchema = emailSchema.extend({
  code: z
    .string()
    .length(6, 'auth.errors.codeLength')
    .regex(/^[0-9]+$/, 'auth.errors.codeNumeric'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type VerifyFormValues = z.infer<typeof verifySchema>;