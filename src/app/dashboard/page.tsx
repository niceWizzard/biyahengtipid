import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | BiyahengTipid',
  description: 'Your BiyahengTipid dashboard — manage routes and view stats.',
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return <DashboardClient user={session.user} />;
}
