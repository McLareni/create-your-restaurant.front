'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui/button';
import type { PinPadProps } from '@/features/staff/types/staff.types';

export const PinPad = ({ onConfirm, isLoading }: PinPadProps) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) setPin((prev) => prev + num);
  };

  const handleClear = () => setPin('');

  const handleConfirmSubmit = () => {
    if (pin.length >= 4) onConfirm(pin);
  };

  return (
    <div className="flex flex-col gap-4 bg-brand-mocha p-4 rounded-2xl border border-brand-gray/10 shadow-lg max-w-xs mx-auto">
      <div className="bg-brand-espresso h-12 rounded-xl border border-brand-gray/20 flex items-center justify-center text-xl font-mono text-brand-emerald font-bold tracking-widest">
        {'*'.repeat(pin.length) || '-'}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            className="h-12 font-bold text-lg text-brand-cream border-brand-gray/20 hover:bg-brand-espresso"
            onClick={() => handleNumberClick(num)}
            disabled={isLoading}
          >
            {num}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="h-12 text-sm text-red-400 font-semibold"
          onClick={handleClear}
          disabled={isLoading}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 font-bold text-lg text-brand-cream border-brand-emerald/30"
          onClick={() => handleNumberClick('0')}
          disabled={isLoading}
        >
          0
        </Button>
        <Button
          type="button"
          variant="brand"
          className="h-12 text-xs font-bold"
          onClick={handleConfirmSubmit}
          disabled={isLoading || pin.length < 4}
        >
          {t('actions.save')}
        </Button>
      </div>
    </div>
  );
};