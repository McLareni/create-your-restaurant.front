import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const path = params.path.join('/');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(request.url);

  const sessionCookie = request.cookies.get('gustio_session');
  const token = sessionCookie?.value;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    // ВАЖЛИВО: Передаємо токен саме як Cookie, бо так прописано в NestMiddleware бекенду
    headers.set('Cookie', `gustio_session=${token}`);
  }

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

    const response = await fetch(`${API_URL}/${path}${url.search}`, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch (error) {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;