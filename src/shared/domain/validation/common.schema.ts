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