import { z } from 'zod';

export const comboDishSchema = z.object({
  id: z.string().min(1, 'menu.constructor.combos.errors.dishIdRequired'),
  name: z.string().min(1, 'menu.constructor.combos.errors.dishNameRequired'),
  price: z.number().min(0, 'menu.constructor.combos.errors.dishPriceNegative'),
});

export const createComboSchema = z.object({
  name: z.string().min(2, 'menu.constructor.combos.errors.nameMin'),
  priceType: z.enum(['FIXED', 'DISCOUNT']),
  priceValue: z.number().min(0, 'menu.constructor.combos.errors.valueMin'),
  dishes: z.array(comboDishSchema).min(1, 'menu.constructor.combos.errors.dishesMin'),
}).refine((data) => {
  if (data.priceType === 'DISCOUNT') {
    return data.priceValue <= 100;
  }
  return true;
}, {
  message: 'menu.constructor.combos.errors.discountMax',
  path: ['priceValue'],
});