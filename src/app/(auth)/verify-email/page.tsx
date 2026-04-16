import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import VerifyEmailClient from './verify-email-client';

export const metadata: Metadata = {
  title: 'Verify Email - BiyahengTipid',
  description: 'Verify your email address to complete your registration.',
};

export default async function VerifyEmailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  // Already verified → redirect to dashboard
  if (session.user.emailVerified) {
    redirect('/dashboard');
  }

  return <VerifyEmailClient email={session.user.email} />;
}
