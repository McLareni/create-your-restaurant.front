import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/users/verify-login-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      return NextResponse.json({ errorCode: 'verifyFailed' }, { status: response.status });
    }

    const data = await response.json();
    const nextResponse = NextResponse.json({ success: true });

    const expiresDate = data.session?.expiresAt 
      ? new Date(data.session.expiresAt) 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    nextResponse.cookies.set('gustio_session', data.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresDate,
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}