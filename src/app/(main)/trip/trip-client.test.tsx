import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TripClient from './[id]/trip-client';
import { Trip } from '@/db/types';
import { StopData } from './[id]/_components/TripStopItem';
import { act, ComponentProps } from 'react';
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

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

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
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
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

    const addStopButton = await screen.findByText(/Add Stop/);
    fireEvent.click(addStopButton);

    expect(screen.getByTestId('stops-count').textContent).toBe('1 stops');
    expect(screen.getByTestId('stop-lat-0').textContent).toBe('10');
    expect(screen.getByTestId('stop-lng-0').textContent).toBe('20');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByText('none')).toBeDefined();
  });

  it('deletes a stop when onDelete is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByTestId('stops-count').textContent).toBe('1 stops');

    const stopId = screen.getByTestId('stop-id-0').textContent;

    fireEvent.click(screen.getByText(`Delete ${stopId}`));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByTestId('stops-count').textContent).toBe('0 stops');
    expect(screen.getByText('none')).toBeDefined();
  });

  it('updates stop location when onStopUpdateLocation is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    const stopId = screen.getByTestId('stop-id-0').textContent;

    fireEvent.click(screen.getByText(new RegExp(`Update ${stopId}`)));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByTestId('stop-lat-0').textContent).toBe('30');
    expect(screen.getByTestId('stop-lng-0').textContent).toBe('40');
    expect(screen.getByText('none')).toBeDefined();
  });

  it('reorders stops when onDragEnd is triggered', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    const stopId1 = screen.getByTestId('stop-id-0').textContent;
    const stopId2 = screen.getByTestId('stop-id-1').textContent;

    fireEvent.click(screen.getByTestId('reorder-button'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByTestId('stop-id-0').textContent).toBe(stopId2);
    expect(screen.getByTestId('stop-id-1').textContent).toBe(stopId1);
    expect(screen.getByText('14,120|15,121')).toBeDefined();
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

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByText('14,120|15,121')).toBeDefined();

    fireEvent.click(screen.getByText(/Add Stop/));

    expect(screen.getByTestId('stops-count').textContent).toBe('25 stops');
    expect(toast.error).toHaveBeenCalledWith(
      'Maximum number of stops reached (25)'
    );
  });

  it('fetches navigation path when 2 or more stops are present', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByTestId('navigation-path').textContent).toBe('none');
    expect(fetchDirections).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(fetchDirections).toHaveBeenCalled();
    expect(screen.getByText('14,120|15,121')).toBeDefined();
  });

  it('clears navigation path when stops count drops below 2', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByText('14,120|15,121')).toBeDefined();

    const stopId1 = screen.getByTestId('stop-id-0').textContent;

    fireEvent.click(screen.getByText(`Delete ${stopId1}`));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByText('none')).toBeDefined();
  });

  it('handles rapid clicks by debouncing API calls', async () => {
    render(<TripClient trip={mockTrip} />);

    // Rapidly add 3 stops
    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));

    // Time hasn't passed yet
    expect(fetchDirections).not.toHaveBeenCalled();

    // Advance time by 500ms
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Should only have been called once despite 3 stops being added
    expect(fetchDirections).toHaveBeenCalledTimes(1);
    expect(screen.getByText('14,120|15,121')).toBeDefined();
  });

  it('updates navigation path when stops are reordered with debounce', async () => {
    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(fetchDirections).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('reorder-button'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(fetchDirections).toHaveBeenCalledTimes(2);
  });

  it('shows loading indicator while fetching navigation path', async () => {
    let resolveDirections: any;
    const directionsPromise = new Promise((resolve) => {
      resolveDirections = resolve;
    });

    vi.mocked(fetchDirections).mockReturnValue(directionsPromise as any);

    render(<TripClient trip={mockTrip} />);

    fireEvent.click(await screen.findByText(/Add Stop/));
    fireEvent.click(screen.getByText(/Add Stop/));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(toast.loading).toHaveBeenCalledWith('Finding path...', {
      id: 'nav-fetch',
    });

    await act(async () => {
      resolveDirections({
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
      });
      await directionsPromise;
    });

    expect(toast.dismiss).toHaveBeenCalledWith('nav-fetch');
  });
});
