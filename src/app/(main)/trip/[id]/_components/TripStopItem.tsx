import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface StopData {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

const renameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
});

type RenameSchema = z.infer<typeof renameSchema>;

export function TripStopItem({
  stop,
  index,
  onDelete,
  onRename,
}: {
  stop: StopData;
  index: number;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stop.id,
  });

  const form = useForm<RenameSchema>({
    resolver: zodResolver(renameSchema),
    defaultValues: {
      name: stop.name,
    },
  });

  const onRenameSubmit = (data: RenameSchema) => {
    onRename(stop.id, data.name);
    setIsRenameOpen(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        data-testid={`stop-card-${stop.id}`}
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
            data-testid="drag-handle"
            className="text-muted-foreground hover:text-foreground cursor-grab p-1 transition-colors active:cursor-grabbing"
          >
            <GripVertical size={20} />
          </div>

          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold shadow-sm">
            {index + 1}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-foreground mb-1 truncate text-sm leading-none font-semibold">
              {stop.name}
            </p>
            <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
              <span className="bg-muted truncate rounded-sm px-1.5 py-0.5">
                Lat: {stop.lat.toFixed(4)}
              </span>
              <span className="bg-muted truncate rounded-sm px-1.5 py-0.5">
                Lng: {stop.lng.toFixed(4)}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  data-testid="dropdown-trigger"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground shrink-0 transition-opacity group-hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-focus-within:opacity-100"
                >
                  <MoreVertical size={18} />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Stop</DialogTitle>
            <DialogDescription>
              Enter a new name for this stop.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onRenameSubmit)}
            className="space-y-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stop-name">Name</FieldLabel>
                  <Input
                    id="stop-name"
                    placeholder="Enter stop name"
                    autoFocus
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldDescription className="text-destructive text-xs">
                      {fieldState.error?.message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="w-fit">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{stop.name}" from your trip. <br /> This action
              is local and can be reverted by not saving the trip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(stop.id);
                setIsDeleteOpen(false);
              }}
              autoFocus
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
