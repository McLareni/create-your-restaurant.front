const DEV_API_URL = 'http://localhost:3001';

export const getApiBaseUrl = () => {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? DEV_API_URL
      : process.env.NEXT_PUBLIC_API_URL ?? '';

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};