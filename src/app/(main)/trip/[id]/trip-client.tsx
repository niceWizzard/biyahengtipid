'use client';

import { Trip } from '@/db/types';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { useMemo, useReducer } from 'react';

import dynamic from 'next/dynamic';

import { arrayMove } from '@dnd-kit/sortable';
import { StopData } from './_components/TripStopItem';
import TripPanel from './_components/TripPanel';
import { DragEndEvent } from '@dnd-kit/core';

enum TripActionType {
  ADD_STOP = 'ADD_STOP',
  DELETE_STOP = 'DELETE_STOP',
  REORDER_STOPS = 'REORDER_STOPS',
  UPDATE_STOP_LOCATION = 'UPDATE_STOP_LOCATION',
}

type TripAction =
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
    };

function tripReducer(state: StopData[], action: TripAction): StopData[] {
  switch (action.type) {
    case TripActionType.ADD_STOP:
      return [...state, { ...action.payload }];
    case TripActionType.DELETE_STOP:
      return state.filter((m) => m.id !== action.payload);
    case TripActionType.UPDATE_STOP_LOCATION: {
      const { id, lat, lng } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, lat, lng } : m));
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
    default:
      return state;
  }
}

export default function TripClient({ trip }: { trip: Trip }) {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import('./_components/MapComponent'), {
        ssr: false,
        loading: () => (
          <div className="bg-background/50 flex h-full w-full items-center justify-center">
            Loading Map...
          </div>
        ),
      }),
    []
  );
  const [stops, dispatch] = useReducer(tripReducer, []);

  const handleDragEnd = (params: { activeId: string; overId: string }) => {
    dispatch({ type: TripActionType.REORDER_STOPS, payload: params });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: TripActionType.DELETE_STOP, payload: id });
  };

  return (
    <div className="bg-background flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden lg:flex-row">
      {/* Sidebar / List Panel */}
      <TripPanel
        trip={trip}
        onDelete={handleDelete}
        onDragEnd={handleDragEnd}
        stops={stops}
      />

      {/* Map Panel */}
      <div className="bg-muted/20 relative z-0 h-1/2 flex-1 lg:h-full">
        <MapComponent
          markers={stops}
          onMapClick={(lat, lng) => {
            dispatch({
              type: TripActionType.ADD_STOP,
              payload: {
                id: crypto.randomUUID(),
                lat,
                lng,
                name: new Date().toISOString(),
              },
            });
          }}
          onStopUpdateLocation={(id, lat, lng) => {
            dispatch({
              type: TripActionType.UPDATE_STOP_LOCATION,
              payload: { id, lat, lng },
            });
          }}
        />
      </div>
    </div>
  );
}
