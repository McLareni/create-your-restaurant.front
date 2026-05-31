import { CreateOrganizationValues } from '../schemas/organization.schema';

export interface CheckSlugResponse {
  isAvailable: boolean;
}

export interface CreateRestaurantPayload {
  title: string;
  slug: string;
  type: string;
  currency: string;
  language: string;
  city?: string;
  phoneNumber?: string;
}

export interface UseCreateOrganizationReturn {
  formData: Partial<CreateOrganizationValues>;
  errors: Partial<Record<keyof CreateOrganizationValues, string>>;
  isCheckingSlug: boolean;
  slugAvailable: boolean | null;
  animationStep: number;
  isLoading: boolean;
  handleChange: (field: keyof CreateOrganizationValues, value: string) => void;
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