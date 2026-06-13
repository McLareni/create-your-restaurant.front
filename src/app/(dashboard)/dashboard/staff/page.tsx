'use client';

import { StaffList } from '@/features/staff/components/staffList';

export default function StaffPage() {
  return (
    <div className="flex h-full flex-col p-5 md:p-6 overflow-hidden">
      <StaffList />
    </div>
  );
}