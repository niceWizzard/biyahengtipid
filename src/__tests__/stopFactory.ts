import { LocalTripStop } from '@/app/(main)/trip/[id]/_components/TripStopItem';
import { TripStop } from '@/db/types';

export const createMockStop = (data: Partial<TripStop> = {}): TripStop => {
  const id = Date.now();
  return {
    id,
    name: 'Test Stop',
    createdAt: new Date(),
    updatedAt: new Date(),
    latitude: 10,
    longitude: 20,
    visitOrder: 1,
    tripId: 1,
    ...data,
  };
};

export const createMockLocalTripStop = (
  data: Partial<LocalTripStop> = {},
): LocalTripStop => {
  const id = Date.now();
  return {
    id: id.toString(),
    name: 'Test Stop',
    latitude: 10,
    longitude: 20,
    visitOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    tripId: 1,
    ...data,
  };
};