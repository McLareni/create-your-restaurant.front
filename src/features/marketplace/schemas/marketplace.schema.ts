import { z } from 'zod';
import { activationCodeSchema } from '@/shared/domain/validation/common.schema';

export const connectModuleSchema = z.object({
  activationCode: activationCodeSchema,
});

export type ConnectModuleFormValues = z.infer<typeof connectModuleSchema>;

export const INITIAL_CONNECT_FORM: ConnectModuleFormValues = {
  activationCode: '',
};