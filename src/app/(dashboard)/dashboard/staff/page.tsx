'use client';

import { StaffList } from '@/features/staff/components/staffList';

export default function StaffPage() {
  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <div className="flex-1 rounded-3xl bg-white shadow-xl border border-brand-gray/20 p-6 overflow-hidden flex flex-col">
        <StaffList />
      </div>
    </div>
  );
}