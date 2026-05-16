import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  theme?: 'light' | 'dark';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, theme = 'light', className = '', id, ...props }, ref) => {
    const isDark = theme === 'dark';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className={`text-sm font-medium ${isDark ? 'text-brand-cream' : 'text-brand-espresso'}`}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 text-brand-gray">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`h-12 w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-espresso outline-none transition-colors placeholder:text-brand-gray/60 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? 'pl-10' : ''
            } ${
              rightElement ? 'pr-[140px]' : ''
            } ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-gray/30'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center gap-2 text-sm text-brand-gray">
              {rightElement}
            </div>
          )}
        </div>
        {hint && !error && <span className={`text-xs ${isDark ? 'text-brand-cream/60' : 'text-brand-gray'}`}>{hint}</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';