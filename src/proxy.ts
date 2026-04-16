import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'] as const;
const NON_AUTH_ROUTES = ['/login', '/register'] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isNonAuth = NON_AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected && !isNonAuth) {
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

  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard/:path*', '/login/:path*', '/register/:path*'],
};
