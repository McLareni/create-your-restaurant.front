import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return NextResponse.json({ errorCode: 'serverError' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ errorCode: 'serverError' }, { status: 500 });
  }
}