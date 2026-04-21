import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TripStopItem, StopData } from './TripStopItem';
import { useSortable } from '@dnd-kit/sortable';

// Mock dnd-kit
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(() => ({
    attributes: { 'data-testid': 'drag-handle-attributes' },
    listeners: { onKeyDown: vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn(() => 'translate3d(0, 0, 0)'),
    },
  },
}));

describe('TripStopItem', () => {
  const mockStop: StopData = {
    id: 'stop-1',
    name: 'Eiffel Tower',
    lat: 48.8584,
    lng: 2.2945,
  };

  const mockOnDelete = vi.fn();

  it('renders stop name and index correctly', () => {
    render(
      <TripStopItem stop={mockStop} index={0} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Eiffel Tower')).toBeDefined();
    // Index + 1 should be displayed
    expect(screen.getByText('1')).toBeDefined();
  });

  it('renders formatted coordinates', () => {
    render(
      <TripStopItem stop={mockStop} index={0} onDelete={mockOnDelete} />
    );

    // Coordinates should be formatted to 4 decimal places
    expect(screen.getByText('Lat: 48.8584')).toBeDefined();
    expect(screen.getByText('Lng: 2.2945')).toBeDefined();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TripStopItem stop={mockStop} index={0} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('stop-1');
  });

  it('applies dragging styles when isDragging is true', () => {
    vi.mocked(useSortable).mockReturnValueOnce({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
      transition: 'transform 200ms ease',
      isDragging: true,
    } as any);

    const { container } = render(
      <TripStopItem stop={mockStop} index={0} onDelete={mockOnDelete} />
    );

    // Check if dragging classes are applied to the Card (first child of the rendered component)
    // The class name includes 'ring-primary' when isDragging is true
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-primary');
    expect(card.className).toContain('scale-[1.02]');
  });
});
