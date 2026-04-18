'use client';

import { Trip } from '@/db/types';
import Link from 'next/link';

export default function DashboardClient({ trips }: { trips: Trip[] }) {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-8">
        {trips.map((trip) => (
          <Link href={`/trip/${trip.id}`} key={trip.id}>
            <div className="rounded-lg border border-gray-200 p-4">
              <h1>{trip.name}</h1>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
