import { CreateOrganizationValues } from '../schemas/organization.schema';

export interface CheckSlugResponse {
  isAvailable: boolean;
}

export interface UseCreateOrganizationReturn {
  formData: Partial<CreateOrganizationValues>;
  errors: Partial<Record<keyof CreateOrganizationValues, string>>;
  isCheckingSlug: boolean;
  slugAvailable: boolean | null;
  animationStep: number;
  isLoading: boolean;
  handleChange: (field: keyof CreateOrganizationValues, value: string) => void;
  handleDaysChange: (days: string[]) => void;
  handleImageChange: (file: File) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
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
  t: (key: string) => string;
}