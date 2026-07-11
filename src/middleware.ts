import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define protected routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/api/auth');
  const isPublicApiRoute = pathname === '/api/writeups' && request.method === 'POST';
  const isApiRoute = pathname.startsWith('/api') && !isAuthRoute && !isPublicApiRoute;

  // 2. Allow unauthenticated access if not protected
  if (!isAdminRoute && !isApiRoute) {
    return NextResponse.next();
  }

  // 3. Check session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Validate JWT
  const payload = await decrypt(sessionCookie);

  if (!payload) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Successful validation, continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
