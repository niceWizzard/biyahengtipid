import { vi } from 'vitest';

export const authClient = {
  signOut: vi.fn(async (options) => {
    // @ts-ignore
    await options?.fetchOptions?.onSuccess?.();
    return {} as any;
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
