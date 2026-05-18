import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 text-brand-gray dark:text-brand-gray/80">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`h-12 w-full rounded-md border bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors placeholder:text-brand-gray/60 dark:placeholder:text-brand-gray/40 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? 'pl-10' : ''
            } ${
              rightElement ? 'pr-35' : ''
            } ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-gray/30 dark:border-brand-gray/50'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center gap-2 text-sm text-brand-gray">
              {rightElement}
            </div>
          )}
        </div>
        {hint && !error && <span className="text-xs text-brand-gray">{hint}</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';