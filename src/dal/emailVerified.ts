import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import 'server-only';

/**
 * Returns the current session only if the user is authenticated AND email-verified.
 * Redirects to /login if not authenticated, /verify-email if not verified.
 * Use this in any server component / page that requires a verified user.
 */
export const requireEmailVerified = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/login');
  if (!session.user.emailVerified) redirect('/verify-email');
  return session;
};

/**
 * Lightweight check — returns true/false without redirecting.
 * Useful for conditional rendering rather than hard guards.
 */
export const isUserEmailVerified = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.emailVerified ?? false;
};
