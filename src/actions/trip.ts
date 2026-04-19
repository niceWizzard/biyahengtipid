'use server';

import { requireEmailVerified } from "@/dal/emailVerified";
import { getTripById, updateTripName as updateTripNameDal } from "@/dal/trip";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
        await updateTripNameDal(id, name)

        // 5. Revalidate
        revalidatePath(`/trip/${validated.id}`);

        return {
            success: true,
            message: "Trip name updated successfully."
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { success: false, message: err.message };
        }
        console.error(err);
        return {
            success: false,
            message: "Something went wrong."
        }
    }
}

