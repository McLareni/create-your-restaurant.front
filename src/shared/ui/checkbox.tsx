import { InputHTMLAttributes, ReactNode, Ref } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  id: string;
  ref?: Ref<HTMLInputElement>;
}

export const Checkbox = ({ label, id, className = '', ref, ...props }: CheckboxProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-5 items-center">
        <input
          id={id}
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 rounded border-stone-500 dark:border-brand-gray/70 bg-transparent text-brand-copper focus:ring-brand-copper focus:ring-offset-0 ${className}`}
          {...props}
        />
      </div>
      <label htmlFor={id} className="text-sm text-stone-400 dark:text-brand-gray">
        {label}
      </label>
    </div>
  );
};