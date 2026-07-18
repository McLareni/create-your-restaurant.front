import { ZodError } from 'zod';

export const formatZodErrors = (
  error: ZodError,
  t: (key: string) => string
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const pathKey = issue.path.join('.');
    if (pathKey) {
      fieldErrors[pathKey] = t(issue.message);
    }
  });
  return fieldErrors;
};