/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTripDialog from './EditTripDialog';
import { updateTripName } from '@/actions/trip';
import { toast } from 'sonner';

vi.mock('@/actions/trip');
vi.mock('sonner');

describe('EditTripDialog', () => {
  const mockTrip = {
    id: 1,
    name: 'Original Trip Name',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the settings trigger button', () => {
    render(<EditTripDialog trip={mockTrip} />);

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeDefined();
  });

  test('opens the dialog and displays the initial trip name', async () => {
    render(<EditTripDialog trip={mockTrip} />);

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    expect(await screen.findByText('Edit Trip')).toBeDefined();
    const input = screen.getByLabelText(/trip name/i) as HTMLInputElement;
    expect(input.value).toBe(mockTrip.name);
  });

  test('shows error message for short trip name', async () => {
    render(<EditTripDialog trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));

    const input = screen.getByLabelText(/trip name/i);
    fireEvent.change(input, { target: { value: 'ab' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/trip name is too short/i)).toBeDefined();
  });

  test('shows error message for long trip name', async () => {
    render(<EditTripDialog trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));

    const input = screen.getByLabelText(/trip name/i);
    fireEvent.change(input, {
      target: { value: 'This trip name is way too long to be valid' },
    });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/trip name is too long/i)).toBeDefined();
  });

  test('handles successful form submission', async () => {
    // Mock success response
    vi.mocked(updateTripName).mockResolvedValue({
      success: true,
      message: 'Trip updated successfully',
    });

    render(<EditTripDialog trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));

    const input = screen.getByLabelText(/trip name/i);
    fireEvent.change(input, { target: { value: 'Updated Trip Name' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTripName).toHaveBeenCalledWith('1', 'Updated Trip Name');
    });

    expect(toast.success).toHaveBeenCalledWith('Trip updated successfully');

    // Dialog should be closed (Edit Trip title should be gone)
    await waitFor(() => {
      expect(screen.queryByText('Edit Trip')).toBeNull();
    });
  });

  test('handles failed form submission', async () => {
    // Mock failure response
    vi.mocked(updateTripName).mockResolvedValue({
      success: false,
      message: 'Something went wrong',
    });

    render(<EditTripDialog trip={mockTrip} />);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));

    const input = screen.getByLabelText(/trip name/i);
    fireEvent.change(input, { target: { value: 'Updated Trip Name' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTripName).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Something went wrong');

    // Dialog should remain open
    expect(screen.getByText('Edit Trip')).toBeDefined();
  });
});
