import 'server-only';
import { requireEmailVerified } from './emailVerified';
import { db } from '@/db';
import { trips as tripsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getTripsOfUser = async () => {
  const session = await requireEmailVerified();
  const userId = session.user.id;

  const trips = await db
    .select()
    .from(tripsTable)
    .where(eq(tripsTable.userId, userId));

  return trips;
};

export const getTripById = async (id: string) => {
  const parsedId = Number(id);

  if (isNaN(parsedId)) {
    throw new Error('Invalid trip ID');
  }

  const trip = await db.query.trips.findFirst({
    where: eq(tripsTable.id, parsedId),
  });

  return trip;
};

export const createTrip = async (userId: string) => {
  const trip = await db
    .insert(tripsTable)
    .values({
      userId,
      name: 'New Trip ' + Date.now().toString(),
    })
    .returning();

  return trip[0];
};

export const updateTripName = async (id: string, name: string) => {
  const parsedId = Number(id);

  if (isNaN(parsedId)) {
    throw new Error('Invalid trip ID');
  }

  const trip = await db
    .update(tripsTable)
    .set({ name })
    .where(eq(tripsTable.id, parsedId));

  return trip;
};

export const deleteTrip = async (id: string) => {
  const parsedId = Number(id);

  if (isNaN(parsedId)) {
    throw new Error('Invalid trip ID');
  }

  await db.delete(tripsTable).where(eq(tripsTable.id, parsedId));
};
