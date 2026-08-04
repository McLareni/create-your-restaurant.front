import React, { useState } from 'react';
import type { ComponentPropsWithRef, ChangeEvent } from 'react';

interface PriceInputProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  value: number | string;
  onChange: (value: number) => void;
}

export const PriceInput = ({
  label,
  error,
  value,
  onChange,
  className = '',
  id,
  disabled,
  ...props
}: PriceInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(() => value === 0 ? '' : String(value ?? ''));
  const [lastPropValue, setLastPropValue] = useState(value);

  // Deriving state in render (Офіційний патерн React для синхронізації пропсів)
  if (value !== lastPropValue) {
    setLastPropValue(value);
    const parsedDisplay = parseFloat(displayValue);
    if (value !== parsedDisplay || isNaN(parsedDisplay)) {
      setDisplayValue(value === 0 ? '' : String(value));
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(',', '.');
    if (raw.length > 1 && raw.startsWith('0') && !raw.startsWith('0.')) {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }
    if (raw === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }
    if (/^\d*\.?\d*$/.test(raw)) {
      setDisplayValue(raw);
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-1.5 select-none">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-text-main/80">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleInputChange}
          disabled={disabled}
          className={`h-11 w-full rounded-xl bg-bg-main/40 border border-solid px-3.5 pr-3.5 text-sm text-text-main outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all placeholder:text-text-muted/40 ${
            error ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 dark:border-neutral-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-semibold text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};