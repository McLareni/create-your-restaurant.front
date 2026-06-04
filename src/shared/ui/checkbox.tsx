import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = ({
  label,
  error,
  className = '',
  id,
  ...props
}: CheckboxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-brand-espresso dark:text-brand-cream">
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-brand-gray/40 text-brand-copper focus:ring-brand-copper/30 disabled:opacity-50 cursor-pointer ${className}`}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};