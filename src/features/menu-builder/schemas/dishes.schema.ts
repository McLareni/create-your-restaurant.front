import { z } from 'zod';

export const dishVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Назва розміру/порції обов\'язкова').catch(''),
  price: z.number().min(0, 'Ціна не може бути від\'ємною').catch(0),
  sku: z.string().optional().catch('')
});

export const ingredientItemSchema = z.object({
  name: z.string().min(1, 'Назва складника обов\'язкова').catch(''),
  quantity: z.number().min(0, 'Кількість не може бути від\'ємною').catch(0),
  unit: z.string().catch('г')
});

export const dishSchema = z.object({
  name: z.string().min(1, 'Назва страви обов\'язкова'),
  description: z.string().nullable().catch('').transform(val => val || ''),
  price: z.number().min(0, 'Ціна не може бути від\'ємною').catch(0),
  variants: z.array(dishVariantSchema).catch([]),
  taxRate: z.number().min(0).max(100).catch(20),
  weight: z.number().nullable().optional().catch(null),
  cookingTime: z.number().nullable().optional().catch(null),
  calories: z.number().nullable().optional().catch(null),
  isVegan: z.boolean().default(false).catch(false),
  isSpicy: z.boolean().default(false).catch(false),
  isLactoseFree: z.boolean().default(false).catch(false),
  badge: z.string().catch('NONE'),
  allergens: z.array(z.string()).catch([]),
  tags: z.array(z.string()).catch([]),
  modifierIds: z.array(z.string()).catch([]),
  isAvailable: z.boolean().catch(true),
  ingredients: z.array(ingredientItemSchema).catch([]),
  upsellDishIds: z.array(z.string()).catch([])
});

export type DishFormValues = z.infer<typeof dishSchema>;