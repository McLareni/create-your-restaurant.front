import { z } from 'zod';

export const activationCodeSchema = z
  .string()
  .max(50, 'common.errors.activationCodeTooLong')
  .regex(/^[A-Z0-9-_]+$/, 'common.errors.activationCodeInvalid')
  .optional()
  .or(z.literal(''));

export const restaurantIdSchema = z
  .number()
  .positive('common.errors.restaurantIdInvalid');

export const strictPriceSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return 0;
  const parsed = Number(val);
  return isNaN(parsed) ? 0 : parsed;
}, z.number().min(0, 'menu.constructor.dishes.modal.errors.priceNegative'));