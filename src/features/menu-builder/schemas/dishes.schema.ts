import { z } from 'zod';

export const dishVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.variantNameRequired').catch(''),
  price: z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative').catch(0),
  sku: z.string().optional().catch('')
});

export const ingredientItemSchema = z.object({
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.ingredientNameRequired').catch(''),
  quantity: z.number().min(0, 'menu.constructor.dishes.modal.errors.ingredientQtyNegative').catch(0),
  unit: z.string().catch('г')
});

const safeNumberPreprocess = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null) return null;
  const parsed = Number(val);
  return isNaN(parsed) ? null : parsed;
}, z.number().nullable().optional());

export const dishSchema = z.object({
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.nameRequired'),
  description: z.string().nullable().catch('').transform(val => val || ''),
  price: z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative').catch(0),
  variants: z.array(dishVariantSchema).catch([]),
  taxRate: z.number().min(0).max(100).catch(20),
  weight: safeNumberPreprocess,
  cookingTime: safeNumberPreprocess,
  calories: safeNumberPreprocess,
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