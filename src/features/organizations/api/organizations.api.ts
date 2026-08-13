import { apiClient } from '@/shared/api/client';
import type { CreateOrganizationValues } from '@/features/organizations/schemas/organization.schema';
import type { CheckSlugResponse } from '@/features/organizations/types/organization.types';

export const organizationApi = {
  checkSlug: (slug: string) => {
    return apiClient.post<CheckSlugResponse>('/restaurants/check-restaurant-slug', { slug });
  },

  create: (data: CreateOrganizationValues) => {
    const payload = {
      title: data.name,
      slug: data.slug,
      type: data.type,
      currency: data.currency,
      language: data.language,
      city: data.city || null,
      phoneNumber: data.phone || null,
      street: data.street || null,
      building: data.building || null,
      workDays: data.workDays,
      workHoursStart: data.workHoursStart,
      workHoursEnd: data.workHoursEnd,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      telegram: data.telegram || null,
      tiktok: data.tiktok || null,
      imageUrl: data.imageUrl || null,
    };

    return apiClient.post<{ message: string; restaurant: { id: number } }>('/restaurants', payload);
  },

  reorder: (ids: number[]) => {
    return apiClient.patch('/restaurants/reorder', { ids });
  }
};