'use client';

import { Trip } from '@/db/types';
import Link from 'next/link';
import CreateTripButton from './_components/CreateTripButton';

export default function DashboardClient({ trips }: { trips: Trip[] }) {
  return (
    <div className="min-h-screen">
      <section className="flex flex-col gap-4 px-4 py-8">
        <CreateTripButton className="w-fit self-end" />
        <div className="flex flex-row flex-wrap gap-4">
          {trips.map((trip) => (
            <Link href={`/trip/${trip.id}`} key={trip.id}>
              <div className="bg-card flex flex-col gap-4 rounded-xl border p-4">
                <h2 className="font-bold tracking-tight">{trip.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {trip.updatedAt.toLocaleDateString()}
                </p>
                <p className="rounded-lg border px-2 py-1 text-center text-sm">
                  View more
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
