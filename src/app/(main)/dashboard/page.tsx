import DashboardClient from './dashboard-client';
import { getTripsOfUser } from '@/dal/trip';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BiyahengTipid',
  description: 'Your BiyahengTipid dashboard — manage routes and view stats.',
};

export default async function DashboardPage() {
  const trips = await getTripsOfUser();

  return <DashboardClient trips={trips} />;
}
