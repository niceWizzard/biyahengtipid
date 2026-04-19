import { vi } from 'vitest';

// Mock server-only to prevent resolution errors in JSDOM tests
vi.mock('server-only', () => ({}));
