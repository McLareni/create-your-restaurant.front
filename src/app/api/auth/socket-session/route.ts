import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('gustio_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ errorCode: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ token: sessionToken });
}