import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5 relative">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`h-12 w-full rounded-md border bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors appearance-none focus:border-brand-copper focus:ring-1 focus:ring-brand-copper disabled:opacity-50 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-gray/30 dark:border-brand-gray/50'
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';