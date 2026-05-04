import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import EditTripDialog from './EditTripDialog';
import { Trip } from '@/db/types';
import { deleteTripStopsAction, deleteTripAction } from '@/actions/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function SettingsDropdown({
  trip,
  onClearStops,
}: {
  trip: Trip;
  onClearStops: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearStopsDialogOpen, setIsClearStopsDialogOpen] = useState(false);
  const [isClearingStops, setIsClearingStops] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteTripAction(trip.id.toString());
      if (res.success) {
        router.push('/dashboard');
      } else {
        toast.error(res.message || 'Something went wrong while deleting trip.');
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
      toast.error('Something went wrong while deleting trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearStops = async () => {
    setIsClearingStops(true);
    try {
      const res = await deleteTripStopsAction(trip.id.toString());
      if (res.success) {
        toast.success(res.message);
        onClearStops();
      } else {
        toast.error(
          res.message || 'Something went wrong while clearing stops.'
        );
      }
    } catch (err) {
      console.error('Error clearing stops:', err);
      toast.error('Something went wrong while clearing stops.');
    } finally {
      setIsClearingStops(false);
      setIsClearStopsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" aria-label="Settings">
              <Settings />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Trip Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit Trip
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              closeOnClick={false}
              onClick={() => setIsClearStopsDialogOpen(true)}
            >
              Clear Stops
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              closeOnClick={false}
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting && <Spinner />}
              {isDeleting ? 'Deleting...' : 'Delete Trip'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTripDialog
        trip={trip}
        isEditing={isEditing}
        onClose={() => setIsEditing(false)}
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete trip?"
        description="This action cannot be undone. This will permanently delete your trip and remove your data from our servers."
        actionButtonText="Confirm Delete"
        cancelButtonText="Cancel"
        destructive
      />

      <ConfirmationDialog
        isOpen={isClearStopsDialogOpen}
        onClose={() => setIsClearStopsDialogOpen(false)}
        onConfirm={handleClearStops}
        isPending={isClearingStops}
        title="Clear all stops?"
        description="This action cannot be undone. This will permanently delete all stops and remove your data from our servers."
        actionButtonText="Clear Stops"
        cancelButtonText="Cancel"
        destructive
      />
    </>
  );
}
