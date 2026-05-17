import { apiClient } from '@/shared/api/client';
import { CreateOrganizationValues } from '../schemas/organization.schema';

export const organizationApi = {
  checkSlug: (slug: string) => {
    return apiClient.get<{ available: boolean }>(`/restaurants/check-slug?slug=${slug}`);
  },

  create: (data: CreateOrganizationValues) => {
    const payload = {
      title: data.name,
      slug: data.slug,
      type: data.type,
      currency: data.currency,
      language: data.language,
      city: data.city,
      phoneNumber: data.phone,
    };

    return apiClient.post('/restaurants', payload);
  },
};