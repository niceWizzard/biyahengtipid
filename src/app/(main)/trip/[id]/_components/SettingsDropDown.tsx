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

export default function SettingsDropdown({ trip }: { trip: Trip }) {
  const [isEditing, setIsEditing] = useState(false);
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
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              Delete Trip
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTripDialog
        trip={trip}
        isEditing={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
}
