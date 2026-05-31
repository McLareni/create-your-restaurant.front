import { apiClient } from '@/shared/api/client';
import { CreateOrganizationValues } from '../schemas/organization.schema';
import { CheckSlugResponse, CreateRestaurantPayload } from '../types/organization.types';

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