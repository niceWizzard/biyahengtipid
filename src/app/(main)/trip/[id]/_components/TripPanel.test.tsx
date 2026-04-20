/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripPanel from './TripPanel';

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  useSensor: vi.fn(),
  useSensors: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div>{children}</div>,
  verticalListSortingStrategy: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  sortableKeyboardCoordinates: vi.fn(),
}));

vi.mock('./TripStopItem', () => ({
  TripStopItem: ({ stop, index, onDelete }: any) => (
    <div data-testid={`stop-item-${stop.id}`}>
      <span>{stop.name}</span>
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

describe('TripPanel', () => {
  const mockTrip = {
    id: 1,
    name: 'Summer Vacation',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStops = [
    { id: '1', name: 'Stop 1', lat: 14.5995, lng: 120.9842 },
    { id: '2', name: 'Stop 2', lat: 14.6042, lng: 120.9822 },
  ];

  const mockOnDragEnd = vi.fn();
  const mockOnDelete = vi.fn();

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
      />
    );

    const saveButton = screen.getByRole('button', {
      name: /save trip itinerary/i,
    });
    expect(saveButton.hasAttribute('disabled')).toBe(false);
  });
});
