import { Metadata } from 'next';
import RegisterClient from './register-client';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Register - BiyahengTipid',
  description:
    'Create an account to start optimizing your routes and save time and fuel with BiyahengTipid.',
  openGraph: {
    title: 'Register - BiyahengTipid',
    description:
      'Create an account to start optimizing your routes and save time and fuel with BiyahengTipid.',
  },
};

export default async function RegisterPage() {
  return <RegisterClient />;
}
