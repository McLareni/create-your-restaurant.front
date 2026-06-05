'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Delete, X } from 'lucide-react';
import type { PinPadProps } from '@/features/staff/types/staff.types';

export const PinPad = ({ maxLength = 4, onConfirm, isLoading = false }: PinPadProps) => {
  const [pin, setPin] = useState('');

  const handleNumberClick = (num: string) => {
    if (isLoading) return;
    if (pin.length >= maxLength) {
      setPin(num);
      return;
    }

    const newPin = pin + num;
    setPin(newPin);
    if (newPin.length === maxLength) {
      onConfirm(newPin);
    }
  };

  const handleDelete = () => {
    if (isLoading) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isLoading) return;
    setPin('');
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-6">
      <div className="flex justify-center gap-4 h-12 items-center">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border-2 transition-all ${
              pin.length > i
                ? 'bg-brand-copper border-brand-copper scale-110'
                : 'border-brand-gray/30 bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            className="h-16 text-xl font-bold rounded-xl active:bg-brand-espresso/5 select-none"
            onClick={() => handleNumberClick(num)}
            disabled={isLoading}
          >
            {num}
          </Button>
        ))}

        <Button
          type="button"
          variant="ghost"
          className="h-16 text-brand-gray hover:text-red-500 rounded-xl"
          onClick={handleClear}
          disabled={isLoading || !pin}
          icon={<X className="h-5 w-5" />}
        >
          {" "}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-16 text-xl font-bold rounded-xl active:bg-brand-espresso/5 select-none"
          onClick={() => handleNumberClick('0')}
          disabled={isLoading}
        >
          0
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-16 text-brand-gray rounded-xl"
          onClick={handleDelete}
          disabled={isLoading || !pin}
          icon={<Delete className="h-5 w-5" />}
        >
          {" "}
        </Button>
      </div>
    </div>
  );
};