import { z } from 'zod';

export const comboDishSchema = z.object({
  id: z.string().min(1, 'ID страви обовʼязковий'),
  name: z.string().min(1, 'Назва страви обовʼязкова'),
  price: z.number().min(0, 'Ціна не може бути відʼємною'),
});

export const createComboSchema = z.object({
  name: z.string().min(2, 'Назва комбо має містити мінімум 2 символи'),
  priceType: z.enum(['FIXED', 'DISCOUNT']),
  priceValue: z.number().min(0, 'Значення ціни або знижки не може бути менше 0'),
  dishes: z.array(comboDishSchema).min(1, 'Оберіть принаймні одну страву для комбо'),
});