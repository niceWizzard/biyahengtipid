import { useState } from 'react';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapIcon, Route } from 'lucide-react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import { Spinner } from '@/components/ui/spinner';
import { fetchDirections } from '@/lib/mapbox';
import { Button } from '@/components/ui/button';
import { Trip } from '@/db/types';

import { LocalTripStop, TripStopItem } from './TripStopItem';

import SettingsDropdown from './SettingsDropDown';
import { AnimatePresence } from 'framer-motion';

interface Props {
  trip: Trip;
  stops: LocalTripStop[];
  onDragEnd: (params: { activeId: string; overId: string }) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onSave: () => void;
  onOptimize: (options: { lockStart: boolean; lockEnd: boolean }) => void;
  isSaving: boolean;
  isOptimizing: boolean;
  onClearStops: () => void;
  distance: number;
}

export default function TripPanel({
  trip,
  stops,
  onDragEnd,
  onDelete,
  onRename,
  onSave,
  isSaving,
  isOptimizing,
  onClearStops,
  onOptimize,
  distance,
}: Props) {
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

  const [lockStart, setLockStart] = useState(true);
  const [lockEnd, setLockEnd] = useState(true);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onDragEnd({ activeId: active.id as string, overId: over.id as string });
    }
  };

  return (
    <div className="bg-card/50 relative z-10 flex h-1/2 w-full flex-col border-r shadow-2xl backdrop-blur-3xl lg:h-full lg:w-[420px] xl:w-[480px]">
      {/* Header Section */}
      <div className="bg-background/80 sticky top-0 z-20 flex flex-col border-b p-6 backdrop-blur-md">
        <div className="mb-1 flex items-center gap-3">
          <div className="bg-primary/10 rounded-2xl p-2.5">
            <Route className="text-primary size-6" />
          </div>
          <div className="flex-1">
            <h2 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-2xl font-extrabold tracking-tight wrap-break-word text-transparent">
              {trip.name}
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              {stops.length} {stops.length === 1 ? 'stop' : 'stops'} • Drag to
              reorder
            </p>
          </div>
          <SettingsDropdown trip={trip} onClearStops={onClearStops} />
        </div>
        <div>
          <p>Distance: {distance}</p>
        </div>
      </div>

      {/* List Section */}
      <div className="custom-scrollbar bg-accent/20 flex-1 overflow-y-scroll p-4">
        {stops.length === 0 ? (
          <div className="text-muted-foreground border-border/60 bg-background/50 flex h-full min-h-[200px] flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed p-8 text-center">
            <div className="bg-muted/50 rounded-full p-4">
              <MapIcon size={40} className="text-muted-foreground/60" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-semibold">
                No stops planned yet
              </p>
              <p className="text-sm text-balance">
                Click anywhere on the map to add your first stop sequentially to
                this trip.
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            id="trip-stops-dnd"
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
              items={stops.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {stops.map((marker, index) => (
                    <TripStopItem
                      key={marker.id}
                      stop={marker}
                      index={index}
                      onDelete={onDelete}
                      onRename={onRename}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-background/80 sticky bottom-0 z-20 border-t p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Optimization Settings</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lock-start" 
                checked={lockStart}
                onCheckedChange={(checked) => {
                  if (!checked && !lockEnd) return;
                  setLockStart(checked as boolean);
                }}
              />
              <Label htmlFor="lock-start" className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Lock Start
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lock-end" 
                checked={lockEnd}
                onCheckedChange={(checked) => {
                  if (!checked && !lockStart) return;
                  setLockEnd(checked as boolean);
                }}
              />
              <Label htmlFor="lock-end" className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Lock End
              </Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="shadow-primary/20 w-full rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
            disabled={stops.length <= 2 || isOptimizing || isSaving}
            onClick={() => onOptimize({ lockStart, lockEnd })}
          >
            {isOptimizing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Optimizing Trip...
              </>
            ) : (
              'Optimize Trip Itinerary'
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-xl font-bold transition-all active:scale-[0.98]"
            disabled={stops.length === 0 || isSaving}
            onClick={onSave}
          >
            {isSaving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving Trip...
              </>
            ) : (
              'Save Trip Itinerary'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
