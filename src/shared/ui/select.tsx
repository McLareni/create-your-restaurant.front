import { ComponentPropsWithRef, ReactNode } from 'react';

interface SelectProps extends ComponentPropsWithRef<'select'> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = ({
  label,
  error,
  children,
  className = '',
  id,
  ...props
}: SelectProps) => {
  return (
    <div className="flex w-full flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <select
          id={id}
          className={`h-11 w-full rounded-xl border bg-bg-main/40 px-3.5 pr-10 text-sm text-text-main outline-none transition-all focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${
            error ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 dark:border-neutral-700'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3.5 flex items-center text-text-muted/60">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs font-semibold text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};