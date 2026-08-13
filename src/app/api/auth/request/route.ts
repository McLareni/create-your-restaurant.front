import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/shared/api/base-url';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const API_URL = getApiBaseUrl();

    if (!API_URL) {
      return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend returned non-OK response:', response.status, errorText);
      
      let backendError = 'serverError';
      try {
        const errData = JSON.parse(errorText);
        backendError = errData.message || backendError;
      } catch {}
      
      return NextResponse.json({ errorCode: backendError }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fetch to backend failed:', error);
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}