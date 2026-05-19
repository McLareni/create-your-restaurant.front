'use client';

import { PricesTab } from '@/features/menu-builder/components/prices/pricesTab';

export default function MenuPricesPage() {
  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <div className="flex-1 rounded-3xl bg-white shadow-xl border border-brand-gray/20 p-6 overflow-hidden flex flex-col">
        <PricesTab />
      </div>
    </div>
  );
}