'use client';

import { Trip } from '@/db/types';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { useMemo, useReducer } from 'react';
import { MapIcon, Route } from 'lucide-react';

import dynamic from 'next/dynamic';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MarkerData, TripStopItem } from './_components/TripStopItem';
import { Button } from '@/components/ui/button';

type TripAction =
  | {
      type: 'ADD_MARKER';
      payload: { lat: number; lng: number; id: string; name: string };
    }
  | { type: 'DELETE_MARKER'; payload: string }
  | { type: 'REORDER_MARKERS'; payload: { activeId: string; overId: string } }
  | {
      type: 'UPDATE_MARKER_LOCATION';
      payload: { id: string; lat: number; lng: number };
    };

function tripReducer(state: MarkerData[], action: TripAction): MarkerData[] {
  switch (action.type) {
    case 'ADD_MARKER':
      return [...state, { ...action.payload }];
    case 'DELETE_MARKER':
      return state.filter((m) => m.id !== action.payload);
    case 'UPDATE_MARKER_LOCATION': {
      const { id, lat, lng } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, lat, lng } : m));
    }
    case 'REORDER_MARKERS': {
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
  const [markers, dispatch] = useReducer(tripReducer, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      dispatch({
        type: 'REORDER_MARKERS',
        payload: {
          activeId: active.id as string,
          overId: over.id as string,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_MARKER', payload: id });
  };

  return (
    <div className="bg-background flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden lg:flex-row">
      {/* Sidebar / List Panel */}
      <div className="bg-card/50 relative z-10 flex h-1/2 w-full flex-col border-r shadow-2xl backdrop-blur-3xl lg:h-full lg:w-[420px] xl:w-[480px]">
        {/* Header Section */}
        <div className="bg-background/80 sticky top-0 z-20 flex flex-col border-b p-6 backdrop-blur-md">
          <div className="mb-1 flex items-center gap-3">
            <div className="bg-primary/10 rounded-2xl p-2.5">
              <Route className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="from-foreground to-foreground/70 truncate bg-linear-to-r bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                {trip.name}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                {markers.length} {markers.length === 1 ? 'stop' : 'stops'} •
                Drag to reorder
              </p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="custom-scrollbar bg-accent/20 flex-1 overflow-y-scroll p-4">
          {markers.length === 0 ? (
            <div className="text-muted-foreground border-border/60 bg-background/50 flex h-full min-h-[200px] flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed p-8 text-center">
              <div className="bg-muted/50 rounded-full p-4">
                <MapIcon size={40} className="text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground font-semibold">
                  No stops planned yet
                </p>
                <p className="text-sm text-balance">
                  Click anywhere on the map to add your first stop sequentially
                  to this trip.
                </p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[
                ({ transform }) => ({
                  ...transform,
                  x: 0,
                }),
              ]}
            >
              <SortableContext
                items={markers.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {markers.map((marker, index) => (
                    <TripStopItem
                      key={marker.id}
                      marker={marker}
                      index={index}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer Section */}
        <div className="bg-background/80 sticky bottom-0 z-20 border-t p-5 backdrop-blur-md">
          <Button
            size="lg"
            className="shadow-primary/20 w-full rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
            disabled={markers.length === 0}
          >
            Save Trip Itinerary
          </Button>
        </div>
      </div>

      {/* Map Panel */}
      <div className="bg-muted/20 relative z-0 h-1/2 flex-1 lg:h-full">
        <MapComponent
          markers={markers}
          onMapClick={(lat, lng) => {
            dispatch({
              type: 'ADD_MARKER',
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
              type: 'UPDATE_MARKER_LOCATION',
              payload: { id, lat, lng },
            });
          }}
        />
      </div>
    </div>
  );
}
