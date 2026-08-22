'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BellRing, Receipt, X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

interface FloatingActionMenuProps {
  onCallWaiter: () => void;
  onAskBill: (paymentMethod: 'CASH' | 'CARD') => void;
  isCallingWaiter: boolean;
}

export const FloatingActionMenu = ({
  onCallWaiter,
  onAskBill,
  isCallingWaiter,
}: FloatingActionMenuProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [waiterCooldown, setWaiterCooldown] = useState(0);
  const [billCooldown, setBillCooldown] = useState(0);
  const [isBillMethodOpen, setIsBillMethodOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setWaiterCooldown((prev) => Math.max(0, prev - 1));
      setBillCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCallWaiter = () => {
    if (waiterCooldown > 0 || isCallingWaiter) return;
    onCallWaiter();
    setWaiterCooldown(60);
    setIsOpen(false);
  };

  const handleAskBill = () => {
    if (billCooldown > 0 || isCallingWaiter) return;
    setIsBillMethodOpen(true);
  };

  const handleBillMethodSelected = (paymentMethod: 'CASH' | 'CARD') => {
    onAskBill(paymentMethod);
    setBillCooldown(60);
    setIsBillMethodOpen(false);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Menu Items */}
      <div 
        className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8 pointer-events-none'
        }`}
      >
        {isBillMethodOpen ? (
          <div className="flex flex-col items-stretch gap-2 rounded-2xl bg-brand-emerald p-3 text-xs font-bold text-white shadow-xl shadow-brand-emerald/20">
            <span className="px-1 text-center uppercase tracking-wider">{t('menu.public.paymentMethod')}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleBillMethodSelected('CASH')} className="rounded-xl border-0 bg-white/20 px-3 py-2 text-white hover:bg-white/30 cursor-pointer">
                {t('menu.public.cash')}
              </button>
              <button type="button" onClick={() => handleBillMethodSelected('CARD')} className="rounded-xl border-0 bg-white/20 px-3 py-2 text-white hover:bg-white/30 cursor-pointer">
                {t('menu.public.card')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAskBill}
            disabled={isCallingWaiter || billCooldown > 0}
            className="flex items-center gap-3 rounded-full bg-brand-emerald pl-4 pr-2 py-2 text-xs font-bold text-white shadow-xl shadow-brand-emerald/20 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 border-0 outline-none cursor-pointer group"
          >
            <span className="uppercase tracking-wider">
              {billCooldown > 0 ? `${billCooldown}с` : t('menu.public.requestBill')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Receipt className="h-4 w-4 text-white" />
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={handleCallWaiter}
          disabled={isCallingWaiter || waiterCooldown > 0}
          className="flex items-center gap-3 rounded-full bg-brand-espresso pl-4 pr-2 py-2 text-xs font-bold text-white shadow-xl transition-transform hover:scale-105 hover:bg-brand-copper active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 border-0 outline-none cursor-pointer group"
        >
          <span className="uppercase tracking-wider">
            {waiterCooldown > 0 
              ? `${waiterCooldown}с` 
              : t('menu.public.callWaiter')
            }
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <BellRing className="h-4 w-4 text-white" />
          </div>
        </button>
      </div>

      {/* Main FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-copper text-white shadow-xl shadow-brand-copper/30 transition-transform hover:scale-105 active:scale-95 border-0 outline-none cursor-pointer z-10 relative"
        aria-label="Actions menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
        ) : (
          <BellRing className="h-6 w-6 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};
