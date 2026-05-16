import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  id: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-5 items-center">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className={`h-4 w-4 rounded border-stone-500 bg-transparent text-brand-copper focus:ring-brand-copper focus:ring-offset-0 ${className}`}
            {...props}
          />
        </div>
        <label htmlFor={id} className="text-sm text-stone-400">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';