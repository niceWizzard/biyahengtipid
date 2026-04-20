import { createTripAction } from '@/actions/trip';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTripButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const trip = await createTripAction();
      if (trip.success) {
        router.push(`/trip/${trip.tripId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className={className} onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Spinner /> : <PlusIcon />}
      {isLoading ? 'Creating...' : 'Create Trip'}
    </Button>
  );
}
