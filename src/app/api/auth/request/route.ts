import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/shared/api/base-url';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const API_URL = getApiBaseUrl();

    if (!API_URL) {
      return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
    }

    console.log("===> МАРШРУТ NEXT.JS СПРАЦЮВАВ! Очікуємо відповідь від бекенду...");

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return NextResponse.json({ errorCode: 'serverError' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}