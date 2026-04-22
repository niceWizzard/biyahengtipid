'use server';

import { requireEmailVerified } from '@/dal/emailVerified';
import {
  createTrip,
  deleteTrip,
  getTripById,
  updateTripName as updateTripNameDal,
  syncTripStops,
} from '@/dal/trip';
import { StopData } from '@/app/(main)/trip/[id]/_components/TripStopItem';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateTripSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Trip name is required').max(100),
});

export const updateTripName = async (id: string, name: string) => {
  try {
    // 1. Validate Input
    const validated = updateTripSchema.parse({ id, name });

    // 2. Authentication Guard
    const session = await requireEmailVerified();

    // 3. Authorization Check (Ownership)
    const trip = await getTripById(validated.id);

    if (!trip) {
      return { success: false, message: 'Trip not found' };
    }

    if (trip.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    // 4. Perform Update
    await updateTripNameDal(id, name);

    // 5. Revalidate
    revalidatePath(`/trip/${validated.id}`);

    return {
      success: true,
      message: 'Trip name updated successfully.',
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, message: err.message };
    }
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
};

export const createTripAction = async () => {
  try {
    const session = await requireEmailVerified();
    const trip = await createTrip(session.user.id);
    return { success: true, tripId: trip.id };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Something went wrong.' };
  }
};

export const deleteTripAction = async (id: string) => {
  try {
    const session = await requireEmailVerified();
    const trip = await getTripById(id);

    if (!trip) {
      return { success: false, message: 'Trip not found' };
    }

    if (trip.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await deleteTrip(id);
    revalidatePath('/trip');
    return { success: true, message: 'Trip deleted successfully.' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Something went wrong.' };
  }
};

export const saveTripStopsAction = async (
  tripId: string,
  stops: StopData[]
) => {
  try {
    // 1. Validation: 1 to 25 stops
    if (stops.length === 0) {
      return { success: false, message: 'Trip must have at least one stop.' };
    }
    if (stops.length > 25) {
      return { success: false, message: 'Maximum 25 stops allowed.' };
    }

    // 2. Authentication
    const session = await requireEmailVerified();

    // 3. Authorization
    const trip = await getTripById(tripId);
    if (!trip) {
      return { success: false, message: 'Trip not found.' };
    }
    if (trip.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized.' };
    }

    // 4. Sync
    const updatedStops = await syncTripStops(tripId, stops);

    // 5. Revalidate
    revalidatePath(`/trip/${tripId}`);

    return {
      success: true,
      message: 'Trip itinerary saved successfully.',
      stops: updatedStops.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        lat: s.latitude,
        lng: s.longitude,
      })),
    };
  } catch (err) {
    console.error('Failed to save trip stops:', err);
    return { success: false, message: 'Something went wrong.' };
  }
};
