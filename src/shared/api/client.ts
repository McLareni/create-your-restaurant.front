const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  
  const isLocalApi = endpoint.startsWith('/api');
  const baseUrl = isLocalApi ? window.location.origin : API_URL;
  const url = new URL(`${baseUrl}${endpoint}`);
  
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errorCode || error.message || 'defaultError');
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};