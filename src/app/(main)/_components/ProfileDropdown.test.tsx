/// <reference types="vitest/globals" />
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileDropdown from './ProfileDropdown';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation');
vi.mock('@/lib/auth-client');

describe('ProfileDropdown', () => {
  const mockPush = vi.fn();

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
  });

  test('renders the trigger button with "Profile" text', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /profile/i });
    expect(trigger).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
  });

  test('opens the dropdown menu when clicked', async () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /profile/i });
    fireEvent.click(trigger);

    expect(await screen.findByText('My Account')).toBeDefined();
    expect(screen.getByRole('menuitem', { name: /^profile$/i })).toBeDefined();
    expect(screen.getByRole('menuitem', { name: /billing/i })).toBeDefined();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeDefined();
  });

  test('calls signOut and redirects to login when Logout is clicked', async () => {
    vi.mocked(authClient.signOut).mockImplementation(async (options) => {
      // @ts-ignore - access internal onSuccess from mock
      options?.fetchOptions?.onSuccess?.();
      return {} as any;
    });

    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /profile/i });
    fireEvent.click(trigger);

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    expect(authClient.signOut).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchOptions: expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
