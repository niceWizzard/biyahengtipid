import { headers } from 'next/headers';
import { requireEmailVerified } from '@/dal/emailVerified';
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | BiyahengTipid',
  description: 'Your BiyahengTipid dashboard — manage routes and view stats.',
};

export default async function DashboardPage() {
  const session = await requireEmailVerified();

  return <DashboardClient user={session.user} />;
}
