import { apiClient } from '@/shared/api/client';
import { CreateOrganizationValues } from '../schemas/organization.schema';

export const organizationApi = {
  // Ендпоінт для debounce-перевірки
  checkSlug: (slug: string) => {
    return apiClient.get<{ available: boolean }>(`/organizations/check-slug?slug=${slug}`);
  },

  // Головний ендпоінт створення
  create: (data: CreateOrganizationValues) => {
    return apiClient.post('/organizations', data);
  },
};