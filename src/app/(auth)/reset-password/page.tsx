import { Metadata } from 'next';
import ResetPasswordClient from './reset-password-client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password - BiyahengTipid',
  description: 'Create a new password for your BiyahengTipid account.',
  openGraph: {
    title: 'Reset Password - BiyahengTipid',
    description: 'Create a new password for your BiyahengTipid account.',
  },
};

export default async function ResetPasswordPage() {
  return <Suspense fallback={<div className="p-4">Loading...</div>}>
    <ResetPasswordClient />
  </Suspense>;
}
