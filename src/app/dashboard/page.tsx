import { headers } from 'next/headers';
import { requireEmailVerified } from '@/dal/emailVerified';
import DashboardClient from './dashboard-client';
import { getTripsOfUser } from '@/dal/trip';

export const metadata = {
  title: 'Dashboard | BiyahengTipid',
  description: 'Your BiyahengTipid dashboard — manage routes and view stats.',
};

export default async function DashboardPage() {
  const trips = await getTripsOfUser();

  return <DashboardClient trips={trips} />;
}
