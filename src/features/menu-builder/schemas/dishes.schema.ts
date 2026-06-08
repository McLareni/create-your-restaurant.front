import { z } from 'zod';

const safeNumberPreprocess = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
  z.number().min(0, 'menu.constructor.dishes.modal.errors.valueMin').nullable()
);

const pricePreprocess = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? 0 : Number(val)),
  z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative')
);

export const dishSchema = z.object({
  name: z.string().min(1, 'menu.constructor.dishes.modal.errors.nameRequired'),
  description: z.string().default(''),
  price: pricePreprocess,
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
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().min(0),
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