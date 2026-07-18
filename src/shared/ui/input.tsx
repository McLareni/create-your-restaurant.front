import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = ({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className = '',
  id,
  ...props
}: InputProps) => {
  return (
    <div className="flex w-full flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 text-text-muted/40">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`h-11 w-full rounded-xl border bg-bg-main/40 px-3.5 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/40 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            leftIcon ? 'pl-10' : ''
          } ${
            rightElement ? 'pr-12' : ''
          } ${
            error ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 dark:border-neutral-700'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center gap-2 text-xs font-semibold text-text-muted">
            {rightElement}
          </div>
        )}
      </div>
      {hint && !error && <span className="text-xs text-text-muted/70 mt-0.5">{hint}</span>}
      {error && <span className="text-xs font-semibold text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};