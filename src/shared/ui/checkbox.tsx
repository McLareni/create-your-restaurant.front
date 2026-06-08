'use client';

import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'children'> {
  id: string;
  error?: string;
  children?: ReactNode;
}

export const Checkbox = ({
  id,
  error,
  children,
  className = '',
  disabled,
  ...props
}: CheckboxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          className={`h-4 w-4 rounded border-brand-gray/30 text-brand-copper focus:ring-brand-copper/30 disabled:opacity-50 cursor-pointer ${className}`}
          {...props}
        />
        {children && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-brand-espresso dark:text-brand-cream select-none cursor-pointer disabled:opacity-50"
          >
            {children}
          </label>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};