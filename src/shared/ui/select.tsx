import { SelectHTMLAttributes, ReactNode, Ref } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
  ref?: Ref<HTMLSelectElement>;
}

export const Select = ({
  label,
  error,
  children,
  className = '',
  id,
  ref,
  ...props
}: SelectProps) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={id}
          className={`h-12 w-full rounded-md border bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-gray/30 dark:border-brand-gray/50'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 flex items-center text-brand-gray">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};