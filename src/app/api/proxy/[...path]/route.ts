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
  const incomingContentType = request.headers.get('content-type');
  
  // Якщо це файл — НЕ встановлюємо Content-Type вручну, fetch згенерує його разом із правильним boundary автоматично
  if (incomingContentType && !incomingContentType.includes('multipart/form-data')) {
    headers.set('Content-Type', incomingContentType);
  }

  if (token) {
    headers.set('Cookie', `gustio_session=${token}`);
  }

  try {
    let body: BodyInit | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (incomingContentType?.includes('multipart/form-data')) {
        // Preserve multipart boundaries and file streams for backend interceptors.
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

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