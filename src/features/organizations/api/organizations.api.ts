import { apiClient } from '@/shared/api/client';
import { CreateOrganizationValues } from '../schemas/organization.schema';

interface CheckSlugResponse {
  isAvailable: boolean;
}

interface CreateRestaurantPayload {
  title: string;
  slug: string;
  type: string;
  currency: string;
  language: string;
  city?: string;
  phoneNumber?: string;
}

export const organizationApi = {
  checkSlug: (slug: string) => {
    return apiClient.post<CheckSlugResponse>('/restaurants/check-restaurant-slug', { slug });
  },

  create: (data: CreateOrganizationValues) => {
    const payload: CreateRestaurantPayload = {
      title: data.name,
      slug: data.slug,
      type: data.type!,
      currency: data.currency!,
      language: data.language!,
      city: data.city || undefined,
      phoneNumber: data.phone || undefined,
    };

    return apiClient.post('/restaurants', payload);
  },
};