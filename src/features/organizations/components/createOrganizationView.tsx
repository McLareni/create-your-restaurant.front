'use client';

import { useCreateOrganization } from '../hooks/useCreateOrganization';
import { CreateOrgAnimation } from './createOrgAnimation';
import { CreateOrgForm } from './createOrgForm';

export const CreateOrganizationView = () => {
  const organizationState = useCreateOrganization();

  if (organizationState.animationStep > 0) {
    return <CreateOrgAnimation state={organizationState} />;
  }

  return <CreateOrgForm state={organizationState} />;
};