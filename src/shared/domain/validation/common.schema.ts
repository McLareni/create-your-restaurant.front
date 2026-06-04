import { z } from 'zod';

// Спільні правила валідації текстових примітивів для всього закладу
export const activationCodeSchema = z
  .string()
  .max(50, 'Код активації занадто довгий')
  .regex(/^[A-Z0-9-_]+$/, 'Некоректний формат промокоду')
  .optional()
  .or(z.literal(''));

export const restaurantIdSchema = z.number().positive('Некоректний ID ресторану');