import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Edit, MapIcon, Route, Settings } from 'lucide-react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Trip } from '@/db/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StopData, TripStopItem } from './TripStopItem';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

interface Props {
  trip: Trip;
  stops: StopData[];
  onDragEnd: (params: { activeId: string; overId: string }) => void;
  onDelete: (id: string) => void;
}

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
});

type TripSchema = z.infer<typeof tripSchema>;

export default function TripPanel({ trip, stops, onDragEnd, onDelete }: Props) {
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

  const form = useForm<TripSchema>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip.name,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onDragEnd({ activeId: active.id as string, overId: over.id as string });
    }
  };

  const onSubmit = (data: TripSchema) => {
    setIsEditing(false);
    form.reset();
    console.log(data);
  };

  return (
    <div className="bg-card/50 relative z-10 flex h-1/2 w-full flex-col border-r shadow-2xl backdrop-blur-3xl lg:h-full lg:w-[420px] xl:w-[480px]">
      {/* Header Section */}
      <div className="bg-background/80 sticky top-0 z-20 flex flex-col border-b p-6 backdrop-blur-md">
        <div className="mb-1 flex items-center justify-center gap-3">
          <div className="bg-primary/10 rounded-2xl p-2.5">
            <Route className="text-primary size-6" />
          </div>
          <div className="flex-1">
            <h2 className="from-foreground to-foreground/70 truncate bg-linear-to-r bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              {trip.name}
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              {stops.length} {stops.length === 1 ? 'stop' : 'stops'} • Drag to
              reorder
            </p>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger
              render={
                <Button variant="ghost" aria-label="Settings">
                  <Settings className="size-5" />
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="tracking-tight">Edit Trip</DialogTitle>
                <DialogDescription>
                  Update your trip name and description.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-foreground/80" htmlFor="trip-name">
                          Trip Name
                        </FieldLabel>
                        <Input
                          id="trip-name"
                          className="bg-background/50 border-input focus:ring-primary/20 focus:border-primary h-12 transition-all"
                          type="text"
                          placeholder="Enter your trip name"
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldDescription className="text-destructive mt-1 text-xs font-medium">
                            {fieldState.error?.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button
                  type="submit"
                  className="shadow-primary/20 w-full rounded-lg font-bold shadow-lg"
                >
                  Save Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
                {stops.map((marker, index) => (
                  <TripStopItem
                    key={marker.id}
                    stop={marker}
                    index={index}
                    onDelete={onDelete}
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
          disabled={stops.length === 0}
        >
          Save Trip Itinerary
        </Button>
      </div>
    </div>
  );
}
