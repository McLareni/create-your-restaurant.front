import { useActionState, useRef, useEffect } from 'react';
import { ZodError } from 'zod';
import { formatZodErrors } from '@/shared/utils/validation';
import toast from 'react-hot-toast';

interface ActionState {
  errors: Record<string, string>;
}

export const useAppActionState = (
  actionFn: (formData: FormData) => Promise<void> | void,
  options: {
    t: (key: string, replace?: Record<string, string | number>) => string;
    successMessage?: string;
    onSuccess?: () => void;
  }
) => {
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const wrappedAction = async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
    try {
      await actionFn(formData);
      if (optionsRef.current.successMessage) {
        toast.success(optionsRef.current.successMessage);
      }
      if (optionsRef.current.onSuccess) {
        optionsRef.current.onSuccess();
      }
      return { errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        return { errors: formatZodErrors(error, optionsRef.current.t) };
      }
      const apiError = error instanceof Error ? error.message : optionsRef.current.t('auth.errors.defaultError');
      toast.error(apiError);
      return { errors: { global: apiError } };
    }
  };

  return useActionState(wrappedAction, { errors: {} });
};