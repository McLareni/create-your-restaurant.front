import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className = '', id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-stone-200">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`h-12 w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-espresso outline-none transition-colors placeholder:text-brand-gray/60 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? 'pl-10' : ''
            } ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-transparent'
            } ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-xs text-stone-400">{hint}</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';