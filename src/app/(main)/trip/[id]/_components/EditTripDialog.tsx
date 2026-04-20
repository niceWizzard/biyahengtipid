import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trip } from '@/db/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { updateTripName } from '@/actions/trip';
const tripSchema = z.object({
  name: z
    .string()
    .min(3, 'Trip name is too short')
    .max(32, 'Trip name is too long'),
});

export type TripSchema = z.infer<typeof tripSchema>;

interface Props {
  trip: Trip;
  isEditing: boolean;
  onClose: () => void;
}

export default function EditTripDialog({ trip, isEditing, onClose }: Props) {
  const form = useForm<TripSchema>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip.name,
    },
  });

  const handleFormSubmit = async (data: TripSchema) => {
    const result = await updateTripName(trip.id.toString(), data.name);
    if (result.success) {
      toast.success(result.message);
      onClose();
      form.reset(data);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={isEditing} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="tracking-tight">Edit Trip</DialogTitle>
          <DialogDescription>
            Update your trip name and description.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-foreground/80"
                    htmlFor="trip-name"
                  >
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
