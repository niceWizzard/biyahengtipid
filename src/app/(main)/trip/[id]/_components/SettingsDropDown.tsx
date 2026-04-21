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
import { deleteTripAction } from '@/actions/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function SettingsDropdown({ trip }: { trip: Trip }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
}
