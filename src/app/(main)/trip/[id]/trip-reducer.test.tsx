import { describe, it, expect } from 'vitest';
import { tripReducer, TripActionType, TripAction } from './trip-reducer';
import { LocalTripStop } from './_components/TripStopItem';
import { createMockLocalTripStop } from '@/__tests__/stopFactory';

describe('tripReducer', () => {
  const initialState: LocalTripStop[] = [
    createMockLocalTripStop({
      id: '1',
      name: 'Stop 1',
      latitude: 10,
      longitude: 10,
      visitOrder: 0,
    }),
    createMockLocalTripStop({
      id: '2',
      name: 'Stop 2',
      latitude: 20,
      longitude: 20,
      visitOrder: 1,
    }),
  ];

  it('handles RENAME_STOP correctly', () => {
    const action = {
      type: TripActionType.RENAME_STOP,
      payload: { id: '1', name: 'New Name' },
    } satisfies TripAction;
    const newState = tripReducer(initialState, action);

    expect(newState).toHaveLength(2);
    expect(newState[0].name).toBe('New Name');
    expect(newState[1].name).toBe('Stop 2');
  });

  it('handles DELETE_STOP correctly', () => {
    const action = {
      type: TripActionType.DELETE_STOP,
      payload: '1',
    } satisfies TripAction;
    const newState = tripReducer(initialState, action);

    expect(newState).toHaveLength(1);
    expect(newState[0].id).toBe('2');
  });

  it('handles ADD_STOP correctly', () => {
    const newStop = createMockLocalTripStop({
      id: '3',
      name: 'Stop 3',
      latitude: 30,
      longitude: 30,
      visitOrder: 2,
    });
    const action = {
      type: TripActionType.ADD_STOP,
      payload: newStop,
    } satisfies TripAction;
    const newState = tripReducer(initialState, action);

    expect(newState).toHaveLength(3);
    expect(newState[2]).toEqual(newStop);
  });

  it('handles REORDER_STOPS correctly', () => {
    const action = {
      type: TripActionType.REORDER_STOPS,
      payload: { activeId: '1', overId: '2' },
    } satisfies TripAction;
    const newState = tripReducer(initialState, action);

    expect(newState[0].id).toBe('2');
    expect(newState[1].id).toBe('1');
  });
});
