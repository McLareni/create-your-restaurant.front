'use client';

import { useCreateOrganization } from '../hooks/useCreateOrganization';
import { CreateOrgAnimation } from './createOrgAnimation';
import { CreateOrgForm } from './createOrgForm';

export const CreateOrganizationView = () => {
  const organizationState = useCreateOrganization();

  if (organizationState.animationStep > 0) {
    return (
      <CreateOrgAnimation 
        state={{
          animationStep: organizationState.animationStep,
          formData: {
            name: organizationState.formData.name ?? '',
            slug: organizationState.formData.slug ?? '',
          }
        }} 
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-main p-4 md:p-8">
      <CreateOrgForm state={organizationState} />
    </div>
  );
};