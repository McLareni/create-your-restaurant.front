import { z } from 'zod';

export const dishSchema = z.object({
  name: z.string().min(2, 'Назва має містити мінімум 2 символи').max(100, 'Назва занадто довга'),
  price: z.number().min(0, 'Ціна не може бути від\'ємною'),
  description: z.string().max(500, 'Опис занадто довгий').optional(),
  weight: z.string().optional(),
  cookingTime: z.string().optional(),
  calories: z.string().optional(),
  isVegan: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isLactoseFree: z.boolean().default(false),
  badge: z.string().default('NONE'),
  allergens: z.array(z.string()).default([]),
});

export type DishFormValues = z.infer<typeof dishSchema>;