import 'server-only';
import { requireEmailVerified } from './emailVerified';
import { db } from '@/db';
import { trips as tripsTable, tripStops } from '@/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { StopData } from '@/app/(main)/trip/[id]/_components/TripStopItem';

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

export const getTripStops = async (tripId: string) => {
  const parsedId = Number(tripId);
  if (isNaN(parsedId)) throw new Error('Invalid trip ID');

  return await db.query.tripStops.findMany({
    where: eq(tripStops.tripId, parsedId),
    orderBy: tripStops.visitOrder,
  });
};

export const syncTripStops = async (tripId: string, stops: StopData[]) => {
  const parsedTripId = Number(tripId);
  if (isNaN(parsedTripId)) throw new Error('Invalid trip ID');

  const existingStops = await getTripStops(tripId);
  const existingIds = existingStops.map((s) => s.id);

  // 1. Identify Deletions (IDs in DB but not in payload)
  // StopData.id is string. Existing IDs are numbers.
  const payloadIds = stops.map((s) => Number(s.id)).filter((id) => !isNaN(id));
  const toDelete = existingIds.filter((id) => !payloadIds.includes(id));

  // 2. Identify Updates and Creations
  const toUpdate = stops
    .map((s, index) => ({ ...s, visitOrder: index }))
    .filter((s) => !isNaN(Number(s.id)));
  const toInsert = stops
    .map((s, index) => ({ ...s, visitOrder: index }))
    .filter((s) => isNaN(Number(s.id)));

  // Delete missing stops
  if (toDelete.length > 0) {
    await db
      .delete(tripStops)
      .where(
        and(eq(tripStops.tripId, parsedTripId), inArray(tripStops.id, toDelete))
      );
  }

  // Update existing stops
  for (const stop of toUpdate) {
    await db
      .update(tripStops)
      .set({
        name: stop.name,
        latitude: stop.lat,
        longitude: stop.lng,
        visitOrder: stop.visitOrder,
        updatedAt: new Date(),
      })
      .where(eq(tripStops.id, Number(stop.id)));
  }

  // Insert new stops
  if (toInsert.length > 0) {
    await db.insert(tripStops).values(
      toInsert.map((stop) => ({
        tripId: parsedTripId,
        name: stop.name,
        latitude: stop.lat,
        longitude: stop.lng,
        visitOrder: stop.visitOrder,
      }))
    );
  }

  // Return the newly synced stops to update the client IDs
  return await getTripStops(tripId);
};
