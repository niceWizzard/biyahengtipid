import { Metadata } from 'next';
import RegisterClient from './register-client';

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

export default function RegisterPage() {
  return <RegisterClient />;
}
