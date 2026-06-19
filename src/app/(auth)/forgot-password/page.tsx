import { Metadata } from 'next';
import ForgotPasswordClient from './forgot-password-client';

export const metadata: Metadata = {
  title: 'Forgot Password - BiyahengTipid',
  description: 'Reset your password for your BiyahengTipid account.',
  openGraph: {
    title: 'Forgot Password - BiyahengTipid',
    description: 'Reset your password for your BiyahengTipid account.',
  },
};

export default async function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
