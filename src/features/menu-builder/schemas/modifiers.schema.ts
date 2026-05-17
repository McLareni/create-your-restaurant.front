import { z } from 'zod';

export const modifierOptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Назва опції обов\'язкова'),
  price: z.number().min(0, 'Ціна не може бути від\'ємною'),
});

export const modifierGroupSchema = z.object({
  name: z.string().min(2, 'Назва має містити мінімум 2 символи'),
  type: z.enum(['SINGLE', 'GROUP']),
  minSelect: z.number().min(0),
  maxSelect: z.number().min(1),
  options: z.array(modifierOptionSchema).min(1, 'Додайте хоча б одну опцію'),
});

export type ModifierFormValues = z.infer<typeof modifierGroupSchema>;