import { z } from 'zod';

export const connectModuleSchema = z.object({
  activationCode: z.string().optional(),
});

export type ConnectModuleFormValues = z.infer<typeof connectModuleSchema>;

export const INITIAL_CONNECT_FORM: ConnectModuleFormValues = {
  activationCode: '',
};