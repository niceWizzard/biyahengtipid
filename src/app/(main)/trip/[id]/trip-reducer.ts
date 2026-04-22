import { arrayMove } from '@dnd-kit/sortable';
import { StopData } from './_components/TripStopItem';

export enum TripActionType {
  ADD_STOP = 'ADD_STOP',
  DELETE_STOP = 'DELETE_STOP',
  REORDER_STOPS = 'REORDER_STOPS',
  UPDATE_STOP_LOCATION = 'UPDATE_STOP_LOCATION',
  RENAME_STOP = 'RENAME_STOP',
  SYNC_STOPS = 'SYNC_STOPS',
}

export type TripAction =
  | {
      type: TripActionType.ADD_STOP;
      payload: { lat: number; lng: number; id: string; name: string };
    }
  | {
      type: TripActionType.DELETE_STOP;
      payload: string;
    }
  | {
      type: TripActionType.REORDER_STOPS;
      payload: { activeId: string; overId: string };
    }
  | {
      type: TripActionType.UPDATE_STOP_LOCATION;
      payload: { id: string; lat: number; lng: number };
    }
  | {
      type: TripActionType.RENAME_STOP;
      payload: { id: string; name: string };
    }
  | {
      type: TripActionType.SYNC_STOPS;
      payload: StopData[];
    };

export function tripReducer(state: StopData[], action: TripAction): StopData[] {
  switch (action.type) {
    case TripActionType.ADD_STOP:
      return [...state, { ...action.payload }];
    case TripActionType.DELETE_STOP:
      return state.filter((m) => m.id !== action.payload);
    case TripActionType.UPDATE_STOP_LOCATION: {
      const { id, lat, lng } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, lat, lng } : m));
    }
    case TripActionType.RENAME_STOP: {
      const { id, name } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, name } : m));
    }
    case TripActionType.REORDER_STOPS: {
      const { activeId, overId } = action.payload;
      const oldIndex = state.findIndex((i) => i.id === activeId);
      const newIndex = state.findIndex((i) => i.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(state, oldIndex, newIndex);
      }
      return state;
    }
    case TripActionType.SYNC_STOPS: {
      return action.payload;
    }
    default:
      return state;
  }
}
