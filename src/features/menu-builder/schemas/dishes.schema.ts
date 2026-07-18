import { z } from 'zod';
import { strictPriceSchema } from '@/shared/domain/validation/common.schema';

const strictNumericPreprocess = (defaultValue: number | null, maxVal: number) => 
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return defaultValue;
    const parsed = Number(val);
    return isNaN(parsed) ? defaultValue : parsed;
  }, z.number().min(0, 'menu.constructor.dishes.modal.errors.valueMin').max(maxVal, 'errors.valueExceeded').nullable());

export const dishSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'menu.constructor.dishes.modal.errors.nameRequired')
    .max(100, 'menu.constructor.dishes.modal.errors.nameTooLong'),
  description: z.string()
    .trim()
    .max(1000, 'menu.constructor.dishes.modal.errors.descriptionTooLong')
    .default(''),
  price: strictPriceSchema.pipe(z.number().max(500000, 'menu.constructor.dishes.modal.errors.priceTooHigh')),
  weight: strictNumericPreprocess(null, 100000),
  cookingTime: strictNumericPreprocess(null, 1440),
  calories: strictNumericPreprocess(null, 50000),
  isVegan: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isLactoseFree: z.boolean().default(false),
  badge: z.string().default('NONE'),
  allergens: z.array(z.string().trim().min(1).max(50)).default([]),
  tags: z.array(z.string().trim().min(1).max(50)).default([]),
  modifierIds: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  ingredients: z.array(
    z.object({
      name: z.string().trim().min(1, 'menu.constructor.dishes.modal.errors.ingredientNameRequired').max(100),
      quantity: z.number().min(0, 'menu.constructor.dishes.modal.errors.ingredientQtyNegative').max(100000),
      unit: z.string(),
      inventoryItemId: z.string().nullable(),
    })
  ).default([]),
});

export type DishFormValues = z.infer<typeof dishSchema>;

export const INITIAL_DISH_FORM: DishFormValues = {
  name: '',
  description: '',
  price: 0,
  weight: null,
  cookingTime: null,
  calories: null,
  isVegan: false,
  isSpicy: false,
  isLactoseFree: false,
  badge: 'NONE',
  allergens: [],
  tags: [],
  modifierIds: [],
  isAvailable: true,
  ingredients: [],
};