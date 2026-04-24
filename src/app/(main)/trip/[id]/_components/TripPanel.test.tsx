/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripPanel from './TripPanel';
import { TripStopItem } from './TripStopItem';
import { ComponentProps } from 'react';
import { createMockLocalTripStop } from '@/__tests__/stopFactory';
import { createMockTrip } from '@/__tests__/tripFactory';

// Mock dnd-kit using central mocks
vi.mock('@dnd-kit/core');
vi.mock('@dnd-kit/sortable');

vi.mock('./TripStopItem', () => ({
  TripStopItem: ({
    stop,
    index,
    onDelete,
    onRename,
  }: ComponentProps<typeof TripStopItem>) => (
    <div data-testid={`stop-item-${stop.id}`}>
      <span>{stop.name}</span>
      <button
        aria-label={`Rename stop ${stop.name}`}
        onClick={() => onRename(stop.id, `Renamed ${stop.name}`)}
      >
        Rename
      </button>
      <button
        aria-label={`Delete stop ${stop.name}`}
        onClick={() => onDelete(stop.id)}
      >
        Delete
      </button>
    </div>
  ),
}));

vi.mock('@/actions/trip');
vi.mock('next/navigation');

describe('TripPanel', () => {
  const mockTrip = createMockTrip({
    name: 'Summer Vacation',
  });

  const mockStops = [
    createMockLocalTripStop({
      id: '1',
      name: 'Stop 1',
      latitude: 14.5995,
      longitude: 120.9842,
      visitOrder: 0,
    }),
    createMockLocalTripStop({
      id: '2',
      name: 'Stop 2',
      latitude: 14.6042,
      longitude: 120.9822,
      visitOrder: 1,
    }),
  ];

  const mockOnDragEnd = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnRename = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders trip name and stops count', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    expect(screen.getByText('Summer Vacation')).toBeDefined();
    expect(screen.getByText(/2 stops/i)).toBeDefined();
  });

  test('renders stop items for each stop', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    expect(screen.getByTestId('stop-item-1')).toBeDefined();
    expect(screen.getByTestId('stop-item-2')).toBeDefined();
    expect(screen.getByText('Stop 1')).toBeDefined();
    expect(screen.getByText('Stop 2')).toBeDefined();
  });

  test('calls onDelete when a stop is deleted', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    const deleteButton = screen.getByLabelText('Delete stop Stop 1');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('shows empty state when there are no stops', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={[]}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    expect(screen.getByText(/no stops planned yet/i)).toBeDefined();
    expect(screen.getByText(/0 stops/i)).toBeDefined();
  });

  test('can open edit trip dialog', async () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    // Settings button (DialogTrigger)
    const settingsButton = screen.getByRole('button', { name: /settings/i });

    fireEvent.click(settingsButton);

    expect(await screen.findByText('Trip Actions')).toBeDefined();
    expect(screen.getByText(/Edit Trip/i)).toBeDefined();
  });

  test('disables "Save Trip Itinerary" button when there are no stops', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={[]}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    const saveButton = screen.getByRole('button', {
      name: /save trip itinerary/i,
    });
    expect(saveButton.hasAttribute('disabled')).toBe(true);
  });

  test('enables "Save Trip Itinerary" button when there are stops', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    const saveButton = screen.getByRole('button', {
      name: /save trip itinerary/i,
    });
    expect(saveButton.hasAttribute('disabled')).toBe(false);
  });

  test('calls onRename when a stop is renamed', () => {
    render(
      <TripPanel
        trip={mockTrip}
        stops={mockStops}
        onDragEnd={mockOnDragEnd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
        onSave={vi.fn()}
        isSaving={false}
      />
    );

    const renameButton = screen.getByLabelText('Rename stop Stop 1');
    fireEvent.click(renameButton);

    expect(mockOnRename).toHaveBeenCalledWith('1', 'Renamed Stop 1');
  });
});
