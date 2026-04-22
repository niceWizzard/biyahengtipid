import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  updateTripName,
  createTripAction,
  deleteTripAction,
  saveTripStopsAction,
} from './trip';
import { requireEmailVerified } from '@/dal/emailVerified';
import {
  getTripById,
  updateTripName as updateTripNameDal,
  createTrip,
  deleteTrip,
  syncTripStops,
} from '@/dal/trip';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('@/dal/emailVerified');
vi.mock('@/dal/trip');
vi.mock('next/cache');

describe('trip actions', () => {
  const mockSession = { user: { id: 'user-1' } };
  const mockTrip = { id: '1', name: 'Original Name', userId: 'user-1' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateTripName', () => {
    it('should update trip name successfully when authenticated and authorized', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(mockTrip as any);

      const result = await updateTripName('1', 'New Trip Name');

      expect(result).toEqual({
        success: true,
        message: 'Trip name updated successfully.',
      });

      expect(updateTripNameDal).toHaveBeenCalledWith('1', 'New Trip Name');
      expect(revalidatePath).toHaveBeenCalledWith('/trip/1');
    });

    it('should return failure if input validation fails', async () => {
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
      vi.mocked(getTripById).mockResolvedValue({
        ...mockTrip,
        userId: 'other-user',
      } as any);

      const result = await updateTripName('1', 'New Name');
      expect(result).toEqual({ success: false, message: 'Unauthorized' });
    });

    it('should return failure and log error if database update fails', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(mockTrip as any);
      vi.mocked(updateTripNameDal).mockRejectedValueOnce(new Error('DB Error'));
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await updateTripName('1', 'New Name');

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong.',
      });
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('createTripAction', () => {
    it('should create trip successfully when authenticated', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(createTrip).mockResolvedValue({ id: 123 } as any);

      const result = await createTripAction();

      expect(result).toEqual({ success: true, tripId: 123 });
      expect(createTrip).toHaveBeenCalledWith('user-1');
    });

    it('should return failure if creation fails', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(createTrip).mockRejectedValueOnce(new Error('Creation failed'));
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await createTripAction();

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong.',
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('deleteTripAction', () => {
    it('should delete trip successfully when authenticated and authorized', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(mockTrip as any);

      const result = await deleteTripAction('1');

      expect(result).toEqual({
        success: true,
        message: 'Trip deleted successfully.',
      });
      expect(deleteTrip).toHaveBeenCalledWith('1');
      expect(revalidatePath).toHaveBeenCalledWith('/trip');
    });

    it('should return failure if trip is not found', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(undefined);

      const result = await deleteTripAction('1');

      expect(result).toEqual({ success: false, message: 'Trip not found' });
    });

    it('should return failure if user is not the owner', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue({
        ...mockTrip,
        userId: 'other-user',
      } as any);

      const result = await deleteTripAction('1');

      expect(result).toEqual({ success: false, message: 'Unauthorized' });
    });

    it('should return failure if deletion fails', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(mockTrip as any);
      vi.mocked(deleteTrip).mockRejectedValueOnce(new Error('Deletion failed'));
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await deleteTripAction('1');

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong.',
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
  describe('saveTripStopsAction', () => {
    const mockStops = [
      { id: '1', name: 'Stop 1', lat: 10, lng: 20 },
      { id: 'uuid-1', name: 'New Stop', lat: 30, lng: 40 },
    ];

    it('should save trip stops successfully', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue(mockTrip as any);
      vi.mocked(syncTripStops).mockResolvedValue([
        {
          id: 1,
          name: 'Stop 1',
          latitude: 10,
          longitude: 20,
          visitOrder: 0,
        },
        {
          id: 2,
          name: 'New Stop',
          latitude: 30,
          longitude: 40,
          visitOrder: 1,
        },
      ] as any);

      const result = await saveTripStopsAction('1', mockStops);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Trip itinerary saved successfully.');
      expect(result.stops).toHaveLength(2);
      expect(result.stops![1].id).toBe('2'); // Resolved numeric ID
      expect(syncTripStops).toHaveBeenCalledWith('1', mockStops);
      expect(revalidatePath).toHaveBeenCalledWith('/trip/1');
    });

    it('should return failure if no stops are provided', async () => {
      const result = await saveTripStopsAction('1', []);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Trip must have at least one stop.');
    });

    it('should return failure if user is not authorized', async () => {
      vi.mocked(requireEmailVerified).mockResolvedValue(mockSession as any);
      vi.mocked(getTripById).mockResolvedValue({
        ...mockTrip,
        userId: 'other-user',
      } as any);

      const result = await saveTripStopsAction('1', mockStops);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized.');
    });
  });
});
