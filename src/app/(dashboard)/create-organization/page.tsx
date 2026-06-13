'use client';

import { CreateOrganizationView } from '@/features/organizations/components/createOrganizationView';

export default function CreateOrganizationPage() {
  return (
    <div className="w-full h-screen overflow-y-auto no-scrollbar">
      <CreateOrganizationView />
    </div>
  );
}