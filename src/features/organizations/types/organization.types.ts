import { CreateOrganizationValues } from '@/features/organizations/schemas/organization.schema';

export interface CheckSlugResponse {
  isAvailable: boolean;
}

export interface UseCreateOrganizationReturn {
  formData: Partial<CreateOrganizationValues>;
  errors: Partial<Record<keyof CreateOrganizationValues, string>>;
  isCheckingSlug: boolean;
  slugAvailable: boolean | null;
  animationStep: number;
  isPending: boolean;
  handleChange: (field: keyof CreateOrganizationValues, value: string) => void;
  handleDaysChange: (days: string[]) => void;
  handleImageChange: (file: File) => Promise<void>;
  formAction: (payload: FormData) => void;
}

export interface CreateOrgFormProps {
  state: UseCreateOrganizationReturn;
}

export interface CreateOrgAnimationProps {
  state: {
    animationStep: number;
    formData: {
      name: string;
      slug: string;
    };
  };
}

export interface CreateOrgCardProps {
  formData: Partial<CreateOrganizationValues>;
}