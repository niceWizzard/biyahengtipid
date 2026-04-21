import { vi } from 'vitest';
import { Transform } from '@dnd-kit/utilities';

export const CSS = {
  Transform: {
    toString: vi.fn((transform: Transform | null) => {
      if (!transform) return '';
      return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    }),
  },
};
