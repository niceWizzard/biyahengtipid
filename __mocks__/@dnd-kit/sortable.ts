import { vi } from 'vitest';
import React from 'react';
import type {
  useSortable as realUseSortable,
  UseSortableArguments,
} from '@dnd-kit/sortable';
import {
  DraggableSyntheticListeners,
} from '@dnd-kit/core';

export const SortableContext = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-testid': 'sortable-context' }, children);

export const verticalListSortingStrategy = vi.fn();
export const sortableKeyboardCoordinates = vi.fn();

export const arrayMove = vi.fn(
  <T>(array: T[], from: number, to: number): T[] => {
    const newArray = array.slice();
    newArray.splice(to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  }
);

// Create a type that satisfies the return of useSortable
export type UseSortableReturn = ReturnType<typeof realUseSortable>;

export const defaultUseSortableReturn: UseSortableReturn = {
  attributes: {
    role: 'button',
    tabIndex: 0,
    'aria-disabled': false,
    'aria-pressed': false,
    'aria-roledescription': 'sortable',
    'aria-describedby': 'dnd-kit-sortable',
  },
  listeners: {
    onKeyDown: vi.fn(),
    onMouseDown: vi.fn(),
  } as DraggableSyntheticListeners,
  setNodeRef: vi.fn(),
  setActivatorNodeRef: vi.fn(),
  setDroppableNodeRef: vi.fn(),
  setDraggableNodeRef: vi.fn(),
  transform: null,
  transition: undefined,
  isDragging: false,
  isSorting: false,
  over: null,
  active: null,
  rect: { current: null },
  index: 0,
  newIndex: 0,
  overIndex: -1,
  data: {
    sortable: {
      containerId: 'default',
      items: [],
      index: 0,
    },
  },
  node: { current: null },
  items: [],
  activeIndex: -1,
  isOver: false,
};

export const useSortable = vi.fn(
  (_args: UseSortableArguments): UseSortableReturn => {
    return defaultUseSortableReturn;
  }
);
