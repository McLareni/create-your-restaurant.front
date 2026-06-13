import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const chunks = cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const sessionCookie = chunks.find((chunk) =>
    chunk.startsWith('gustio_session='),
  );

  if (!sessionCookie) {
    return NextResponse.json({ errorCode: 'unauthorized' }, { status: 401 });
  }

  const rawToken = sessionCookie.slice('gustio_session='.length);

  if (!rawToken) {
    return NextResponse.json({ errorCode: 'unauthorized' }, { status: 401 });
  }

  try {
    return NextResponse.json({ token: decodeURIComponent(rawToken) });
  } catch {
    return NextResponse.json({ token: rawToken });
  }
}
