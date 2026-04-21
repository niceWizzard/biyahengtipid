import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TripClient from './[id]/trip-client';
import { Trip } from '@/db/types';
import { StopData } from './[id]/_components/TripStopItem';
import { ComponentProps } from 'react';
import MapComponent from './[id]/_components/MapComponent';
import TripPanel from './[id]/_components/TripPanel';
import { toast } from 'sonner';
import { fetchDirections } from '@/lib/mapbox';

vi.mock('@/lib/mapbox', () => ({
  fetchDirections: vi.fn().mockResolvedValue({
    routes: [
      {
        geometry: {
          coordinates: [
            [120, 14],
            [121, 15],
          ],
        },
      },
    ],
  }),
}));

if (!global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () =>
        'test-uuid-' + Math.random().toString(36).substring(2, 9),
    },
    writable: true,
  });
}

vi.mock('next/dynamic', () => ({
  default: () => {
    return function MockMapComponent(
      props: ComponentProps<typeof MapComponent>
    ) {
      return (
        <div data-testid="map-component">
          <div data-testid="navigation-path">
            {props.navigationPath
              ? props.navigationPath
                  .map((p) => (p as number[]).join(','))
                  .join('|')
              : 'none'}
          </div>
          <button onClick={() => props.onMapClick(10, 20)}>
            Add Stop (10, 20)
          </button>
          {props.markers.map((marker: (typeof props.markers)[0]) => (
            <div key={marker.id} data-testid={`map-marker-${marker.id}`}>
              <button
                onClick={() => props.onStopUpdateLocation(marker.id, 30, 40)}
              >
                Update {marker.id} to (30, 40)
              </button>
            </div>
          ))}
        </div>
      );
    };
  },
}));

vi.mock('./[id]/_components/TripPanel', () => ({
  default: function MockTripPanel(props: ComponentProps<typeof TripPanel>) {
    return (
      <div data-testid="trip-panel">
        <h1 data-testid="trip-name">{props.trip.name}</h1>
        <div data-testid="stops-count">{props.stops.length} stops</div>
        <div data-testid="stops-list">
          {props.stops.map((stop: StopData, index: number) => (
            <div key={stop.id} data-testid={`stop-item-${index}`}>
              <span data-testid={`stop-id-${index}`}>{stop.id}</span>
              <span data-testid={`stop-lat-${index}`}>{stop.lat}</span>
              <span data-testid={`stop-lng-${index}`}>{stop.lng}</span>
              <button onClick={() => props.onDelete(stop.id)}>
                Delete {stop.id}
              </button>
            </div>
          ))}
        </div>
        {props.stops.length >= 2 && (
          <button
            data-testid="reorder-button"
            onClick={() =>
              props.onDragEnd({
                activeId: props.stops[0].id,
                overId: props.stops[1].id,
              })
            }
          >
            Swap First Two
          </button>
        )}
      </div>
    );
  },
}));

vi.mock('./[id]/_components/MapComponent', () => ({
  default: () => <div data-testid="real-map-component">Real Map</div>,
}));

vi.mock('sonner');

const mockTrip: Trip = {
  id: 1,
  name: 'Test Trip',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TripClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with initial state', async () => {
    render(<TripClient trip={mockTrip} />);

    expect(screen.getByTestId('trip-panel')).toBeDefined();
    expect(screen.getByTestId('trip-name').textContent).toBe('Test Trip');
    expect(screen.getByTestId('stops-count').textContent).toBe('0 stops');
    expect(await screen.findByTestId('map-component')).toBeDefined();
  });

  it('adds a stop when onMapClick is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    // Trigger add stop through the mock UI
    const addStopButton = await screen.findByText(/Add Stop/);
    fireEvent.click(addStopButton);

    // Verify stop was added
    expect(screen.getByTestId('stops-count').textContent).toBe('1 stops');
    expect(screen.getByTestId('stop-lat-0').textContent).toBe('10');
    expect(screen.getByTestId('stop-lng-0').textContent).toBe('20');

    // Ensure navigation path is settled
    await screen.findByText('none');
  });

  it('deletes a stop when onDelete is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add a stop first
    fireEvent.click(await screen.findByText(/Add Stop/));
    expect(screen.getByTestId('stops-count').textContent).toBe('1 stops');

    const stopId = screen.getByTestId('stop-id-0').textContent;

    // Delete the stop
    fireEvent.click(screen.getByText(`Delete ${stopId}`));

    expect(screen.getByTestId('stops-count').textContent).toBe('0 stops');

    // Ensure navigation path is settled
    await screen.findByText('none');
  });

  it('updates stop location when onStopUpdateLocation is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add a stop
    fireEvent.click(await screen.findByText(/Add Stop/));
    const stopId = screen.getByTestId('stop-id-0').textContent;

    // Trigger update melalui mock MapComponent
    fireEvent.click(screen.getByText(new RegExp(`Update ${stopId}`)));

    // Verify coordinates updated
    expect(screen.getByTestId('stop-lat-0').textContent).toBe('30');
    expect(screen.getByTestId('stop-lng-0').textContent).toBe('40');

    // Ensure navigation path is settled
    await screen.findByText('none');
  });

  it('reorders stops when onDragEnd is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add two stops
    fireEvent.click(await screen.findByText(/Add Stop/));
    const stopId1 = screen.getByTestId('stop-id-0').textContent;

    fireEvent.click(screen.getByText(/Add Stop/));
    const stopId2 = screen.getByTestId('stop-id-1').textContent;

    expect(stopId1).not.toBe(stopId2);

    // Swap them
    fireEvent.click(screen.getByTestId('reorder-button'));

    // Verify order swapped
    expect(screen.getByTestId('stop-id-0').textContent).toBe(stopId2);
    expect(screen.getByTestId('stop-id-1').textContent).toBe(stopId1);

    // Ensure navigation path is settled (triggers for >= 2 stops)
    await screen.findByText('14,120|15,121');
  });

  it('limits the number of stops to 25', async () => {
    const stops = Array.from({ length: 25 }, (_, i) => ({
      id: i.toString(),
      lat: i,
      lng: i,
      name: i.toString(),
    }));
    render(<TripClient trip={mockTrip} initialStops={stops} />);

    expect(screen.getByTestId('stops-count').textContent).toBe('25 stops');

    // Wait for navigation path to settle from initial stops
    await screen.findByText('14,120|15,121');

    // Try to add one more
    fireEvent.click(screen.getByText(/Add Stop/));

    expect(screen.getByTestId('stops-count').textContent).toBe('25 stops');
    expect(toast.error).toHaveBeenCalledWith(
      'Maximum number of stops reached (25)'
    );
  });

  it('fetches navigation path when 2 or more stops are present', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add first stop
    fireEvent.click(await screen.findByText(/Add Stop/));
    expect(screen.getByTestId('navigation-path').textContent).toBe('none');
    expect(fetchDirections).not.toHaveBeenCalled();

    // Add second stop
    fireEvent.click(screen.getByText(/Add Stop/));

    // Verify fetchDirections was called
    await waitFor(() => {
      expect(fetchDirections).toHaveBeenCalled();
    });

    // Verify navigation path is updated (swapped [lng, lat] to [lat, lng])
    await screen.findByText('14,120|15,121');
  });

  it('clears navigation path when stops count drops below 2', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add two stops
    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));

    await screen.findByText('14,120|15,121');

    const stopId1 = screen.getByTestId('stop-id-0').textContent;

    // Delete one stop
    fireEvent.click(screen.getByText(`Delete ${stopId1}`));

    // Verify navigation path is cleared
    await screen.findByText('none');
  });

  it('updates navigation path when stops are reordered', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add two stops
    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));

    await waitFor(() => {
      expect(fetchDirections).toHaveBeenCalledTimes(1);
    });

    // Reorder stops
    fireEvent.click(screen.getByTestId('reorder-button'));

    // Verify fetchDirections was called again
    await waitFor(() => {
      expect(fetchDirections).toHaveBeenCalledTimes(2);
    });
  });

  it('updates navigation path when a stop is deleted from 3 stops', async () => {
    render(<TripClient trip={mockTrip} />);

    // Add three stops
    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));

    await waitFor(() => {
      expect(fetchDirections).toHaveBeenCalledTimes(2); // Called when 2nd and 3rd added
    });

    const stopId2 = screen.getByTestId('stop-id-1').textContent;

    // Delete middle stop
    fireEvent.click(screen.getByText(`Delete ${stopId2}`));

    // Verify fetchDirections was called again (3rd time)
    await waitFor(() => {
      expect(fetchDirections).toHaveBeenCalledTimes(3);
    });

    // Verification path remains as fetchDirections returns same mock value
    await screen.findByText('14,120|15,121');
  });
});
