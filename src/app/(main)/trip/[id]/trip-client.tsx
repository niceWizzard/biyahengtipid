'use client';

import { Trip } from '@/db/types';
import 'leaflet/dist/leaflet.css';
import { useMemo, useReducer } from 'react';
import { GripVertical, Trash2, MapIcon, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

type TripAction =
  | {
      type: 'ADD_MARKER';
      payload: { lat: number; lng: number; id: string; name: string };
    }
  | { type: 'DELETE_MARKER'; payload: string }
  | { type: 'REORDER_MARKERS'; payload: { activeId: string; overId: string } };

function tripReducer(state: MarkerData[], action: TripAction): MarkerData[] {
  switch (action.type) {
    case 'ADD_MARKER':
      return [...state, { ...action.payload }];
    case 'DELETE_MARKER':
      return state.filter((m) => m.id !== action.payload);
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

function SortableMarkerItem({
  marker,
  index,
  onDelete,
}: {
  marker: MarkerData;
  index: number;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: marker.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden transition-colors ${
        isDragging
          ? 'ring-primary scale-[1.02] opacity-90 shadow-2xl ring-2'
          : 'hover:border-primary/40 shadow-sm'
      }`}
    >
      <div className="bg-card flex flex-row items-center gap-3 p-3">
        <div
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-foreground cursor-grab p-1 transition-colors active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </div>

        <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold shadow-sm">
          {index + 1}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-foreground mb-1 truncate text-sm leading-none font-semibold">
            {marker.name}
          </p>
          <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
            <span className="bg-muted truncate rounded-sm px-1.5 py-0.5">
              Lat: {marker.lat.toFixed(4)}
            </span>
            <span className="bg-muted truncate rounded-sm px-1.5 py-0.5">
              Lng: {marker.lng.toFixed(4)}
            </span>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(marker.id);
          }}
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-opacity group-hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-focus-within:opacity-100"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </Card>
  );
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
      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
        .leaflet-popup-content-wrapper {
          border: 1px solid var(--border) / 0.5);
          border-radius: calc(var(--radius) + 4px) !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-close-button {
          color: var(--muted-foreground) !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }
      `}</style>
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
        <div className="custom-scrollbar bg-accent/20 flex-1 overflow-y-auto p-5">
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
            <div className="h-full overflow-x-clip pb-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={markers.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3">
                    {markers.map((marker, index) => (
                      <SortableMarkerItem
                        key={marker.id}
                        marker={marker}
                        index={index}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
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
        />
      </div>
    </div>
  );
}
