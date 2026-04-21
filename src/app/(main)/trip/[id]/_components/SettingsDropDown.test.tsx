/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SettingsDropdown from './SettingsDropDown';
import { deleteTripAction } from '@/actions/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mock child component
vi.mock('./EditTripDialog', () => ({
  __esModule: true,
  default: vi.fn(({ isEditing }) =>
    isEditing ? <div data-testid="edit-dialog">Edit Trip Dialog</div> : null
  ),
}));

vi.mock('./DeleteConfirmDialog', () => ({
  __esModule: true,
  default: vi.fn(({ isOpen, onConfirm, isPending }) =>
    isOpen ? (
      <div data-testid="delete-confirm-dialog">
        <button onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    ) : null
  ),
}));

vi.mock('@/actions/trip', () => ({
  deleteTripAction: vi.fn(),
  updateTripName: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SettingsDropdown', () => {
  const mockTrip = {
    id: 1,
    name: 'Test Trip',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
  });

  test('renders settings button', () => {
    render(<SettingsDropdown trip={mockTrip} />);
    expect(screen.getByRole('button', { name: /settings/i })).toBeDefined();
  });

  test('opens dropdown menu and shows items', async () => {
    render(<SettingsDropdown trip={mockTrip} />);

    const trigger = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(trigger);

    expect(await screen.findByText('Trip Actions')).toBeDefined();
    expect(screen.getByText('Edit Trip')).toBeDefined();
    expect(screen.getByText('Delete Trip')).toBeDefined();
  });

  test('opens edit dialog when Edit Trip is clicked', async () => {
    render(<SettingsDropdown trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(await screen.findByText('Edit Trip'));

    expect(screen.getByTestId('edit-dialog')).toBeDefined();
  });

  test('calls deleteTripAction and redirects on success', async () => {
    vi.mocked(deleteTripAction).mockResolvedValue({
      success: true,
      message: '',
    });

    render(<SettingsDropdown trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(await screen.findByText('Delete Trip'));

    // Confirm in dialog
    fireEvent.click(await screen.findByText('Confirm Delete'));

    await waitFor(() => {
      expect(deleteTripAction).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error toast on delete failure', async () => {
    vi.mocked(deleteTripAction).mockRejectedValue(new Error('Delete failed'));

    render(<SettingsDropdown trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(await screen.findByText('Delete Trip'));

    // Confirm in dialog
    fireEvent.click(await screen.findByText('Confirm Delete'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong while deleting trip.'
      );
    });
  });

  test('shows loading state while deleting', async () => {
    // Mock a slow response
    let resolveDelete: (res: any) => void;
    const deletePromise = new Promise((resolve) => {
      resolveDelete = resolve;
    });
    vi.mocked(deleteTripAction).mockReturnValue(deletePromise as any);

    render(<SettingsDropdown trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(await screen.findByText('Delete Trip'));

    // Confirm in dialog
    fireEvent.click(await screen.findByText('Confirm Delete'));

    await waitFor(async () => {
      const dialog = screen.getByTestId('delete-confirm-dialog');
      expect(within(dialog).getByText('Deleting...')).toBeDefined();
    }, { timeout: 2000 });

    const dialog = screen.getByTestId('delete-confirm-dialog');
    const confirmBtn = within(dialog).getByText('Deleting...');
    expect(confirmBtn.hasAttribute('disabled')).toBe(true);

    // Resolve the promise
    resolveDelete!({ success: true });

    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).toBeNull();
    });
  });
});
