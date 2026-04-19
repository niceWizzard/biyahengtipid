import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateTripName } from './trip';
import { requireEmailVerified } from '@/dal/emailVerified';
import { getTripById, updateTripName as updateTripNameDal } from '@/dal/trip';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('@/dal/emailVerified');
vi.mock('@/dal/trip');
vi.mock('next/cache');

describe('updateTripName', () => {
    const mockSession = { user: { id: 'user-1' } };
    const mockTrip = { id: '1', name: 'Original Name', userId: 'user-1' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update trip name successfully when authenticated and authorized', async () => {
        // Setup mocks
        vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
        vi.mocked(getTripById).mockResolvedValue(mockTrip as any);

        const result = await updateTripName('1', 'New Trip Name');

        expect(result).toEqual({
            success: true,
            message: 'Trip name updated successfully.'
        });
        
        expect(updateTripNameDal).toHaveBeenCalledWith('1', 'New Trip Name');
        expect(revalidatePath).toHaveBeenCalledWith('/trip/1');
    });

    it('should return failure if input validation fails', async () => {
        // Empty trip name (violates .min(1))
        const result = await updateTripName('1', '');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Trip name is required');
    });

    it('should return failure if trip is not found', async () => {
        vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
        vi.mocked(getTripById).mockResolvedValue(undefined);

        const result = await updateTripName('1', 'New Name');

        expect(result).toEqual({ success: false, message: 'Trip not found' });
    });

    it('should return failure if user is not the owner', async () => {
        vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
        vi.mocked(getTripById).mockResolvedValue({ ...mockTrip, userId: 'other-user' } as any);

        const result = await updateTripName('1', 'New Name');
        expect(result).toEqual({ success: false, message: 'Unauthorized' });
    });

    it('should return failure and log error if database update fails', async () => {
        vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
        vi.mocked(getTripById).mockResolvedValue(mockTrip as any);
        
        // Setup db.where to throw
        vi.mocked(updateTripNameDal).mockRejectedValueOnce(new Error('DB Error'));
        // Mock console.error to avoid cluttering test output
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await updateTripName('1', 'New Name');

        expect(result).toEqual({ success: false, message: 'Something went wrong.' });
        expect(consoleSpy).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
    });
});
