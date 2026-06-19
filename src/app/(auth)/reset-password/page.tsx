import { Metadata } from 'next';
import ResetPasswordClient from './reset-password-client';

export const metadata: Metadata = {
  title: 'Reset Password - BiyahengTipid',
  description: 'Create a new password for your BiyahengTipid account.',
  openGraph: {
    title: 'Reset Password - BiyahengTipid',
    description: 'Create a new password for your BiyahengTipid account.',
  },
};

export default async function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
