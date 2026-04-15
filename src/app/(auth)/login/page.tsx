import { Metadata } from 'next';
import LoginClient from './login-client';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Login - BiyahengTipid',
  description:
    'Sign in to your BiyahengTipid account to continue your journey.',
  openGraph: {
    title: 'Login - BiyahengTipid',
    description:
      'Sign in to your BiyahengTipid account to continue your journey.',
  },
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/dashboard');
  }

  return <LoginClient />;
}
