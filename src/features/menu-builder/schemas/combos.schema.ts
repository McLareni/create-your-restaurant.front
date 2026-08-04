import { z } from 'zod';

export const createComboSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'menu.constructor.combos.errors.nameMin')
    .max(100, 'menu.constructor.combos.errors.nameMax'),
  priceType: z.enum(['FIXED', 'DISCOUNT'], {
    message: 'menu.constructor.combos.errors.priceTypeRequired',
  }),
  priceValue: z.number({
    message: 'menu.constructor.combos.errors.mustBeNumber',
  })
    .min(0, 'menu.constructor.combos.errors.valueMin')
    .max(1000000, 'menu.constructor.combos.errors.valueMax'),
  dishes: z.array(
    z.object({
      id: z.string(),
    })
  ).min(1, 'menu.constructor.combos.errors.dishesMin'),
}).refine((data) => {
  if (data.priceType === 'DISCOUNT') {
    return data.priceValue <= 100;
  }
  return true;
}, {
  message: 'menu.constructor.combos.errors.discountMax',
  path: ['priceValue'],
});

export type ComboFormValues = z.infer<typeof createComboSchema>;