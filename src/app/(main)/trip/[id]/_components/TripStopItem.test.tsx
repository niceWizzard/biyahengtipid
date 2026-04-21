import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TripStopItem, StopData } from './TripStopItem';
import { useSortable } from '@dnd-kit/sortable';
import { defaultUseSortableReturn } from '../../../../../../__mocks__/@dnd-kit/sortable';

// Mock dnd-kit using central mocks
vi.mock('@dnd-kit/sortable');
vi.mock('@dnd-kit/utilities');

// Mock Radix UI components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ render, children }: any) => <>{render || children}</>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div onClick={onClick} role="menuitem">
      {children}
    </div>
  ),
}));

// Mock Dialog and AlertDialog to just render children
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: any) =>
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogCancel: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('TripStopItem', () => {
  const mockStop: StopData = {
    id: 'stop-1',
    name: 'Eiffel Tower',
    lat: 48.8584,
    lng: 2.2945,
  };

  const mockOnDelete = vi.fn();
  const mockOnRename = vi.fn();

  const mockedUseSortable = vi.mocked(useSortable);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupDefaultSortableMock = () => {
    mockedUseSortable.mockImplementation(() => defaultUseSortableReturn);
  };

  it('renders stop name and index correctly', () => {
    setupDefaultSortableMock();
    render(
      <TripStopItem
        stop={mockStop}
        index={0}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    expect(screen.getByText('Eiffel Tower')).toBeDefined();
    // Check for the handle
    expect(screen.getByTestId('drag-handle')).toBeDefined();
  });

  it('renders formatted coordinates', () => {
    setupDefaultSortableMock();
    render(
      <TripStopItem
        stop={mockStop}
        index={0}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    // Coordinates should be formatted to 4 decimal places
    expect(screen.getByText('Lat: 48.8584')).toBeDefined();
    expect(screen.getByText('Lng: 2.2945')).toBeDefined();
  });

  it('opens delete dialog and calls onDelete when confirmed', () => {
    setupDefaultSortableMock();
    render(
      <TripStopItem
        stop={mockStop}
        index={0}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    // Click the dropdown trigger
    const dropdownTrigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(dropdownTrigger);

    // Click Delete in the menu
    const deleteItem = screen.getByText(/delete/i);
    fireEvent.click(deleteItem);

    // Check if AlertDialog appears
    expect(screen.getByText(/Are you sure/i)).toBeDefined();

    // Click Delete in the dialog
    const confirmDelete = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmDelete);

    expect(mockOnDelete).toHaveBeenCalledWith('stop-1');
  });

  it('opens rename dialog and calls onRename when submitted', async () => {
    setupDefaultSortableMock();
    render(
      <TripStopItem
        stop={mockStop}
        index={0}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    // Click the dropdown trigger
    const dropdownTrigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(dropdownTrigger);

    // Click Rename in the menu
    const renameItem = screen.getByText(/rename/i);
    fireEvent.click(renameItem);

    // Check if Dialog appears
    expect(screen.getByText(/Rename Stop/i)).toBeDefined();

    // Change the name in the input
    const input = screen.getByPlaceholderText(/Enter stop name/i);
    fireEvent.change(input, { target: { value: 'New Stop Name' } });

    // Click Save
    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnRename).toHaveBeenCalledWith('stop-1', 'New Stop Name');
    });
  });

  it('applies dragging styles when isDragging is true', () => {
    mockedUseSortable.mockImplementation(() => ({
      ...defaultUseSortableReturn,
      transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
      transition: 'transform 200ms ease',
      isDragging: true,
      isSorting: true,
      activeIndex: 0,
    }));

    render(
      <TripStopItem
        stop={mockStop}
        index={0}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    // Check if dragging classes are applied to the Card
    const card = screen.getByTestId('stop-card-stop-1');
    expect(card.className).toContain('ring-primary');
    expect(card.className).toContain('scale-[1.02]');
  });
});
