import { z } from 'zod';

export const comboDishSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number()
});

export const comboSchema = z.object({
  name: z.string().min(2, 'Назва має містити мінімум 2 символи'),
  priceType: z.enum(['FIXED', 'DISCOUNT']),
  priceValue: z.number().min(0, 'Ціна/Знижка не може бути від\'ємною'),
  dishes: z.array(comboDishSchema).min(1, 'Додайте хоча б одну страву до комбо'),
});

export type ComboFormValues = z.infer<typeof comboSchema>;