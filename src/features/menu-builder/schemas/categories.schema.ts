import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string()
    .min(2, 'menu.constructor.categories.errors.nameMin')
    .max(50, 'menu.constructor.categories.errors.nameMax'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;