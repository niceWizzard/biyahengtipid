import { render, screen } from '@testing-library/react';
import DashboardClient from './dashboard-client';

vi.mock('./_components/CreateTripButton', () => ({
  default: (props: any) => <button>Create Trip</button>,
}));
vi.mock('next/link', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@/dal/emailVerified');
vi.mock('@/dal/trip');

describe('DashboardClient', () => {
  it('shows empty message when no trips', () => {
    render(<DashboardClient trips={[]} />);

    expect(screen.getByText(/no trips yet/i)).toBeDefined();
  });

  it('shows trips when there are trips', async () => {
    const trips = [
      {
        id: 1,
        name: 'Trip 1',
        updatedAt: new Date(),
        createdAt: new Date(),
        userId: '1',
      },
    ];
    render(<DashboardClient trips={trips} />);

    expect(screen.getByText('Trip 1')).toBeDefined();
  });
});
