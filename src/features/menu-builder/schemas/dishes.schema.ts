import { z } from 'zod';

export const dishVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.variantNameRequired'),
  price: z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative'),
  sku: z.string().optional()
});

export const ingredientItemSchema = z.object({
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.ingredientNameRequired'),
  quantity: z.number().min(0, 'menu.constructor.dishes.modal.errors.ingredientQtyNegative'),
  unit: z.string().default('г')
});

const safeNumberPreprocess = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null) return null;
  const parsed = Number(val);
  return isNaN(parsed) ? null : parsed;
}, z.number().nullable().optional());

export const dishSchema = z.object({
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.nameRequired'),
  description: z.string().default('').transform(val => val || ''),
  price: z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative'),
  variants: z.array(dishVariantSchema).default([]),
  taxRate: z.number().min(0).max(100).default(20),
  weight: safeNumberPreprocess,
  cookingTime: safeNumberPreprocess,
  calories: safeNumberPreprocess,
  isVegan: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isLactoseFree: z.boolean().default(false),
  badge: z.string().default('NONE'),
  allergens: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  modifierIds: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  ingredients: z.array(ingredientItemSchema).default([]),
  upsellDishIds: z.array(z.string()).default([])
});

export type DishFormValues = z.infer<typeof dishSchema>;