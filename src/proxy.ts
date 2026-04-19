import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'] as const;
const NON_AUTH_ROUTES = ['/login', '/register'] as const;
const VERIFY_EMAIL_ROUTE = '/verify-email';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isNonAuth = NON_AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isVerifyEmail = pathname.startsWith(VERIFY_EMAIL_ROUTE);

  if (!isProtected && !isNonAuth && !isVerifyEmail) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (isNonAuth && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isVerifyEmail && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login/:path*',
    '/register/:path*',
    '/verify-email/:path*',
  ],
};
