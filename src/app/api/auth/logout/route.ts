import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApiBaseUrl } from '@/shared/api/base-url';

export async function POST(request: NextRequest) {
  const API_URL = getApiBaseUrl();
  const sessionCookie = request.cookies.get('gustio_session');
  const token = sessionCookie?.value;

  if (token && API_URL) {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': `gustio_session=${token}`
        },
      });
    } catch (error) {
      console.error('Failed to call backend logout:', error);
    }
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('gustio_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}