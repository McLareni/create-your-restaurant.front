'use client';

import { InventoryTab } from '@/features/menu-builder/components/inventory/inventoryTab';

export default function MenuInventoryPage() {
  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <InventoryTab />
    </div>
  );
}