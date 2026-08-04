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

export const strictPriceSchema = z
  .number()
  .min(0, 'menu.constructor.dishes.modal.errors.priceNegative');

export const emailPrimitiveSchema = z
  .string()
  .min(1, 'staff.errors.emailRequired')
  .email('staff.errors.emailInvalid')
  .max(100, 'staff.errors.emailTooLong')
  .regex(/^[^\u0400-\u04FF]+$/, 'staff.errors.emailCyrillic');

export const phonePrimitiveSchema = z
  .string()
  .min(1, 'staff.errors.phoneRequired')
  .max(30, 'staff.errors.phoneTooLong')
  .regex(/^\+?[0-9\s()-]{7,20}$/, 'staff.errors.phoneInvalid');

export const namePrimitiveSchema = z
  .string()
  .min(1, 'staff.errors.firstNameRequired')
  .max(50, 'staff.errors.firstNameTooLong')
  .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'’-]+$/, 'staff.errors.firstNameInvalid');