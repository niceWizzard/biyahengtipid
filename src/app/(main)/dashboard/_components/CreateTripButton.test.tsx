import { describe, expect, test } from 'vitest';
import CreateTripButton from './CreateTripButton';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { createTripAction } from '@/actions/trip';

vi.mock('next/navigation');
vi.mock('server-only');
vi.mock('@/dal/emailVerified');
vi.mock('@/dal/trip');
vi.mock('@/actions/trip');

describe('CreateTripButton', () => {
  const mockPush = vi.fn();
  const mockedData = {
    name: 'Test Trip',
    id: 67,
  };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as any);

    vi.mocked(createTripAction).mockResolvedValue({
      success: true,
      tripId: mockedData.id,
    });
  });

  test('renders the button', () => {
    render(<CreateTripButton />);
    expect(screen.getByText('Create Trip')).toBeDefined();
  });

  test('goes to loading state when clicked', async () => {
    render(<CreateTripButton />);
    const button = screen.getByText('Create Trip');
    fireEvent.click(button);
    expect(await screen.findByText('Creating...')).toBeDefined();
  });

  test('returns to initial state after api call', async () => {
    render(<CreateTripButton />);
    const button = screen.getByText('Create Trip');
    fireEvent.click(button);

    expect(await screen.findByText('Creating...')).toBeDefined();
    expect(mockPush).toHaveBeenCalledWith('/trip/67');
    expect(await screen.findByText('Create Trip')).toBeDefined();
  });

  test('navigates to /trip/67 when clicked', async () => {
    render(<CreateTripButton />);
    const button = screen.getByText('Create Trip');
    fireEvent.click(button);

    expect(await screen.findByText('Creating...')).toBeDefined();
    expect(mockPush).toHaveBeenCalledWith('/trip/67');
  });

  test('disables the button while loading', async () => {
    render(<CreateTripButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button.hasAttribute('disabled')).toBe(true);
    await screen.findByText('Create Trip');
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  test('does not navigate and stops loading if createTripAction fails', async () => {
    vi.mocked(createTripAction).mockResolvedValue({
      success: false,
    } as any);

    render(<CreateTripButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(await screen.findByText('Creating...')).toBeDefined();
    await screen.findByText('Create Trip');
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('logs error and stops loading if createTripAction throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(createTripAction).mockRejectedValue(new Error('Network Error'));

    render(<CreateTripButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(await screen.findByText('Creating...')).toBeDefined();
    await screen.findByText('Create Trip');

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('applies custom className', () => {
    const customClass = 'test-class-name';
    render(<CreateTripButton className={customClass} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain(customClass);
  });
});
