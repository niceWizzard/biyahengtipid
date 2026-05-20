'use server';

import { LocalTripStop } from "@/app/(main)/trip/[id]/_components/TripStopItem";
import { optimizeTripStops } from "@/lib/optimization";

export const optimizeTripStopsAction = async (stops: LocalTripStop[], options?: { lockStart?: boolean; lockEnd?: boolean }) => {
    try {
        const optimizedStops = await optimizeTripStops(stops, 'driving-car', options);
        return { success: true, stops: optimizedStops };
    } catch (error) {
        console.error('Failed to optimize trip stops:', error);
        return { success: false, message: 'Something went wrong.' };
    }
}