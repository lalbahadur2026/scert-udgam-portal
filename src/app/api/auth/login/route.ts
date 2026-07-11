import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Scert@1234';

    if (email === adminEmail && password === adminPassword) {
      // Create session
      const expires = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
      const session = await encrypt({ user: { role: 'admin' }, expires });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('session', session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'अमान्य क्रेडेंशियल्स (Invalid Credentials)' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'सर्वर एरर (Server Error)' },
      { status: 500 }
    );
  }
}
