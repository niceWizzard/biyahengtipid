import { getTripById, getTripStops } from '@/dal/trip';
import TripClient from './trip-client';
import { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: PageProps<'/trip/[id]'>): Promise<Metadata> => {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    return {
      title: 'Trip not found',
    };
  }

  return {
    title: `${trip.name} - BiyahengTipid`,
    description: `Manage your ${trip.name} trip and view stats.`,
  };
};

export default async function TripPage({ params }: PageProps<'/trip/[id]'>) {
  const { id } = await params;
  const trip = await getTripById(id);
  const stops = await getTripStops(id);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <TripClient
      trip={trip}
      initialStops={stops.map((v) => ({
        ...v,
        lat: v.latitude,
        lng: v.longitude,
        id: v.id.toString(),
      }))}
    />
  );
}
