import { getTripById } from '@/dal/trip';
import TripClient from './trip-client';

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return <TripClient trip={trip} />;
}
