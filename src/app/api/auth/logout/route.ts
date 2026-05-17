import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const sessionCookie = request.cookies.get('gustio_session');
    const token = sessionCookie?.value;

    if (token) {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
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
  } catch (error) {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}