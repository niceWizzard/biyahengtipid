import { vi } from 'vitest';

export const authClient = {
  signOut: vi.fn(async (options) => {
    await options?.fetchOptions?.onSuccess?.();
    return {};
  }),
  useSession: vi.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    isPending: false,
  })),
};
