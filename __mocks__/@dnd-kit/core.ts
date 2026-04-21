import { vi } from 'vitest';
import React from 'react';
import type { Sensor } from '@dnd-kit/core';

export const DndContext = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-testid': 'dnd-context' }, children);

export const useSensor = vi.fn((sensor: Sensor<any>) => sensor);
export const useSensors = vi.fn((...sensors: Sensor<any>[]) => sensors);
export const PointerSensor = vi.fn();
export const KeyboardSensor = vi.fn();
export const closestCenter = vi.fn();

export const MouseSensor = vi.fn();
export const TouchSensor = vi.fn();

export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}
