import { apiClient } from '@/shared/api/client';

export const authApi = {
  requestLoginCode: (email: string) => {
    return apiClient.post('/api/auth/request', { email });
  },

  verifyLoginCode: (email: string, code: string) => {
    return apiClient.post('/api/auth/verify', { email, code });
  },

  logout: () => {
    return apiClient.post('/api/auth/logout');
  }
};