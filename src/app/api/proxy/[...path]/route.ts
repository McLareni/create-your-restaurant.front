// src/app/api/proxy/[...path]/route.ts
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
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }

  const sessionCookie = request.cookies.get('gustio_session');
  const token = sessionCookie?.value;

  const headers = new Headers();
  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) {
    headers.set('Content-Type', incomingContentType);
  }

  if (token) {
    headers.set('Cookie', `gustio_session=${token}`);
  }

  try {
    let body: ArrayBuffer | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer();
    }

    const response = await fetch(`${API_URL}/${path}${url.search}`, {
      method: request.method,
      cache: 'no-store',
      headers,
      body,
    });
    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;