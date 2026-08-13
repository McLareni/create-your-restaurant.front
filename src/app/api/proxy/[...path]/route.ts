import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/shared/api/base-url';

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const path = params.path.join('/');
  const API_URL = getApiBaseUrl();
  const url = new URL(request.url);

  if (!API_URL) {
    return NextResponse.json({ errorCode: 'errors.server_error' }, { status: 500 });
  }

  const sessionCookie = request.cookies.get('gustio_session');
  const token = sessionCookie?.value;

  const restaurantCookie = request.cookies.get('gustio_active_restaurant_id');
  const restaurantId = restaurantCookie?.value;

  const headers = new Headers();
  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) {
    headers.set('Content-Type', incomingContentType);
  }

  if (token) {
    headers.set('Cookie', `gustio_session=${token}`);
  }

  const clientRestaurantId = request.headers.get('x-restaurant-id');
  if (clientRestaurantId) {
    headers.set('x-restaurant-id', clientRestaurantId);
  } else if (restaurantId) {
    headers.set('x-restaurant-id', restaurantId);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  try {
    const response = await fetch(`${API_URL}/${path}${url.search}`, {
      method: request.method,
      cache: 'no-store',
      headers,
      body: hasBody ? request.body : undefined,
      duplex: hasBody ? 'half' : undefined,
    } as RequestInit);

    const resHeaders = new Headers();
    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      resHeaders.set('Content-Type', contentType);
    }
    resHeaders.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    return new NextResponse(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error('[Proxy Error]', request.method, path, error);
    return NextResponse.json({ errorCode: 'errors.server_error' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;