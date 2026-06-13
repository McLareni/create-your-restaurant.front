'use client';

import { QrTablesTab } from '@/features/qr-tables/components/qrTablesTab';

export default function QrTablesPage() {
  return (
    <div className="flex h-full flex-col bg-bg-main p-4 md:p-8 overflow-hidden select-none animate-fade-in">
      <QrTablesTab />
    </div>
  );
}