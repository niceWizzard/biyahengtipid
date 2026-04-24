import { Trip } from '@/db/types';

export const createMockTrip = (data: Partial<Trip> = {}): Trip => {
  const id = Date.now();
  return {
    id: id,
    userId: '1',
    name: 'Test Trip',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
};

