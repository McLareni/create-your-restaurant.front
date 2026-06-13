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
          className={`h-4 w-4 appearance-none rounded border border-solid bg-bg-surface dark:bg-bg-element border-neutral-300 dark:border-neutral-700 relative cursor-pointer outline-none transition-all disabled:opacity-50 checked:border-emerald-500 checked:dark:border-emerald-400 checked:after:content-[''] checked:after:absolute checked:after:left-[5px] checked:after:top-[1px] checked:after:w-[4px] checked:after:h-[8px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-emerald-500 checked:dark:after:border-emerald-400 checked:after:rotate-45 ${className}`}
          {...props}
        />
        {children && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-main select-none cursor-pointer disabled:opacity-50"
          >
            {children}
          </label>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};