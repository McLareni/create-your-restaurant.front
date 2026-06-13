interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
}

async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, timeout = 10000, ...customConfig } = options;
  const isLocalAuth = endpoint.startsWith('/api/auth');
  
  let urlStr = endpoint;
  if (!isLocalAuth) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    urlStr = `/api/proxy/${cleanEndpoint}`;
  }

  if (params) {
    const searchParams = new URLSearchParams(params);
    urlStr += `?${searchParams.toString()}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const isFormData = customConfig.body instanceof FormData;
  const finalHeaders: HeadersInit = { ...headers };
  if (!isFormData) {
    (finalHeaders as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...customConfig,
    headers: finalHeaders,
    signal: controller.signal,
  };

  try {
    const response = await fetch(urlStr, config);
    clearTimeout(timeoutId);
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('unauthorized');
    }

    if (!response.ok) {
      let errorMessage = 'serverError';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.errorCode || errorMessage;
      } catch {
        // ВИПРАВЛЕНО: Видалено невикористану змінну 'e'
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: unknown) {
    // ВИПРАВЛЕНО: Переведено з 'any' на 'unknown' з валідацією типу
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('serverError');
    }
    
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    }),
    
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    }),
    
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    }),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};