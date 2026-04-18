import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export function TripStopItem({
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
