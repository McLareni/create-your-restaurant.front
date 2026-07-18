'use client';

import React from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label?: string;
  error?: string;
}

export const SearchInput = ({
  label,
  error,
  className = '',
  id,
  disabled,
  placeholder,
  value,
  onChange,
  ...props
}: SearchInputProps) => {
  return (
    <div className="flex w-full flex-col gap-1.5 select-none">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <div className="p-2.5 border border-solid border-border-main/40 bg-bg-surface flex items-center gap-2 w-full rounded-md shrink-0 focus-within:border-brand-emerald/50 focus-within:ring-1 focus-within:ring-brand-emerald/20 transition-all">
          <Search className="h-4 w-4 text-text-muted shrink-0" />
          <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-transparent text-xs font-medium text-text-main outline-none border-0 p-0 placeholder:text-text-muted/40 ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            } ${className}`}
            {...props}
          />
        </div>
      </div>
      {error && <span className="text-xs font-semibold text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};