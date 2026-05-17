interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  
  const isLocalAuth = endpoint.startsWith('/api/auth');
  
  let urlStr = endpoint;
  if (!isLocalAuth) {
    // Направляємо всі запити на наш внутрішній сервер
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    urlStr = `/api/proxy/${cleanEndpoint}`;
  }

  if (params) {
    const searchParams = new URLSearchParams(params);
    urlStr += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  const response = await fetch(urlStr, config);

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