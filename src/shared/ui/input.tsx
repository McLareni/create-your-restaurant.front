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
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-text-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-4 text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`h-12 w-full rounded-xl border bg-bg-surface dark:bg-bg-element px-4 py-2 text-sm text-text-main outline-none transition-colors placeholder:text-text-muted/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-50 ${
            leftIcon ? 'pl-11' : ''
          } ${
            rightElement ? 'pr-35' : ''
          } ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-main'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 flex items-center gap-2 text-sm text-text-muted">
            {rightElement}
          </div>
        )}
      </div>
      {hint && !error && <span className="text-xs text-text-muted/70">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};