import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const sessionCookie = request.cookies.get('gustio_session');
  const token = sessionCookie?.value;

  if (token && API_URL) {
    try {
      // Спробуємо сповістити бекенд про логаут, але ігноруємо помилку мережі, якщо він лежить
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Backend logout cleanup failed:', error);
    }
  }

  // Кука на клієнті повинна бути зачищена в будь-якому випадку для запобігання Infinite Redirect Loop
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