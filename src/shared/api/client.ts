interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  timeout?: number; // Додаємо можливість вказати таймаут
}

async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // Ставимо 5 секунд за замовчуванням
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

  // Створюємо контролер для обриву завислих запитів
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal, // Прив'язуємо сигнал до fetch
  };

  try {
    const response = await fetch(urlStr, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.errorCode || error.message || 'defaultError');
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Якщо помилка виникла через наш AbortController
    if (error.name === 'AbortError') {
      console.warn(`[API Timeout]: Запит до ${endpoint} перевищив час очікування (${timeout}ms)`);
      throw new Error('serverError'); 
    }
    
    throw error;
  }
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