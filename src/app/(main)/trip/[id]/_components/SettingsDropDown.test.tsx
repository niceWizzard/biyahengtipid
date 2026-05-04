/// <reference types="vitest/globals" />
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import SettingsDropdown from './SettingsDropDown';
import { deleteTripAction } from '@/actions/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { ComponentProps } from 'react';

// Mock child component
vi.mock('./EditTripDialog', () => ({
  __esModule: true,
  default: vi.fn(({ isEditing }) =>
    isEditing ? <div data-testid="edit-dialog">Edit Trip Dialog</div> : null
  ),
}));

vi.mock('@/components/ConfirmationDialog', () => ({
  default: vi.fn((props: ComponentProps<typeof ConfirmationDialog>) =>
    props.isOpen ? (
      <div data-testid="confirmation-dialog">
        <button onClick={props.onConfirm} disabled={props.isPending}>
          {props.isPending ? 'Loading...' : props.actionButtonText}
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
    vi.mocked(deleteTripAction).mockResolvedValue({
      success: false,
      message: 'Failed to delete trip',
    });

    render(<SettingsDropdown trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(await screen.findByText('Delete Trip'));

    // Confirm in dialog
    fireEvent.click(await screen.findByText('Confirm Delete'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete trip');
    });
  });

  test('shows error toast when deleteTripAction throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(deleteTripAction).mockRejectedValue(new Error('Network Error'));

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

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
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

    await waitFor(
      async () => {
        const dialog = screen.getByTestId('confirmation-dialog');
        expect(within(dialog).getByText('Loading...')).toBeDefined();
      },
      { timeout: 2000 }
    );

    const dialog = screen.getByTestId('confirmation-dialog');
    const confirmBtn = within(dialog).getByText('Loading...');
    expect(confirmBtn.hasAttribute('disabled')).toBe(true);

    // Resolve the promise
    resolveDelete!({ success: true });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });
  });
});
