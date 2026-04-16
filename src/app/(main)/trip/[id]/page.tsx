import { getTripById } from '@/dal/trip';
import React from 'react';

export default async function TripPage({ params }: { params: { id: string } }) {
  const trip = await getTripById(params.id);

  return <div>{JSON.stringify(trip, null, 2)}</div>;
}
