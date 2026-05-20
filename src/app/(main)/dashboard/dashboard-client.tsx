'use client';

import { Trip } from '@/db/types';
import Link from 'next/link';
import CreateTripButton from './_components/CreateTripButton';
import { Map, Clock, ArrowRight, Route, Compass } from 'lucide-react';

export default function DashboardClient({ trips }: { trips: Trip[] }) {
  return (
    <div className="bg-background text-foreground from-primary/5 via-background to-background min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] px-4 py-6 pb-24">
      {/* Header Section */}
      <header className="relative container mx-auto flex flex-col items-start justify-between gap-8 overflow-hidden px-6 pt-32 pb-16 md:flex-row md:items-end md:px-8 lg:px-12">
        <div className="relative z-10 max-w-2xl">
          <div className="animate-in fade-in slide-in-from-left-4 fill-mode-both duration-700 ease-out">
            <h1 className="from-primary to-primary/60 mb-4 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-6xl">
              Your Journeys
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              Manage your upcoming trips, track your destinations, and plan your
              next big adventure.
            </p>
          </div>
        </div>
        <div className="animate-in fade-in zoom-in-95 fill-mode-both z-10 delay-200 duration-500">
          <CreateTripButton className="hover:shadow-primary/25 rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300" />
        </div>

        {/* Decorative background SVG */}
        <div className="pointer-events-none absolute top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4 opacity-30 mix-blend-multiply dark:opacity-10 dark:mix-blend-lighten">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="h-160 w-160"
          >
            <path
              fill="currentColor"
              className="text-primary/30"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.1,15.3,83.5,30.6,74.2,42.5C64.8,54.4,50.7,62.8,36.2,68.8C21.7,74.8,6.8,78.4,-7.8,77.5C-22.3,76.5,-36.5,71,-49.2,62.4C-61.9,53.8,-73.1,42.1,-80.1,28C-87.1,13.9,-89.9,-2.7,-86.3,-17.9C-82.7,-33,-72.6,-46.8,-60.1,-55.8C-47.5,-64.8,-32.5,-69,-18.2,-72.8C-3.9,-76.6,9.6,-80,24.8,-79.8C40.1,-79.7,55,-76,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </header>

      <main className="container mx-auto md:px-8 lg:px-12">
        {trips.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both grid grid-cols-1 gap-6 delay-100 duration-700 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => (
              <div key={trip.id} className="group h-full">
                <Link
                  href={`/trip/${trip.id}`}
                  className="focus-visible:ring-primary block h-full rounded-2xl outline-none focus-visible:ring-2"
                >
                  <div className="bg-card/60 border-border/50 hover:border-primary/40 relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Hover Gradient Overlay */}
                    <div className="from-primary/10 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="bg-primary/10 text-primary rounded-xl p-3 shadow-inner">
                          <Map className="h-6 w-6" />
                        </div>
                        <div className="text-muted-foreground bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Intl.DateTimeFormat('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }).format(trip.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <h2 className="group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold tracking-tight transition-colors duration-300">
                        {trip.name}
                      </h2>

                      <div className="text-primary mt-auto flex items-center justify-between pt-6 text-sm font-semibold">
                        <span className="flex items-center gap-2">
                          <Route className="h-4 w-4" />
                          View Details
                        </span>
                        <div className="bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex h-8 w-8 transform items-center justify-center rounded-full shadow-sm transition-all duration-300 group-hover:translate-x-1">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-border/60 bg-muted/20 animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-4 py-8 text-center backdrop-blur-sm delay-300 duration-700">
            <div className="bg-primary/10 text-primary mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-inner">
              <Compass className="h-12 w-12" />
            </div>
            <h3 className="mb-3 text-2xl font-bold tracking-tight">
              No trips planned yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
              It looks like your itinerary is empty. Start planning your next
              adventure today!
            </p>
            <CreateTripButton className="rounded-full px-8 py-6 text-base shadow-md transition-shadow hover:shadow-lg" />
          </div>
        )}
      </main>
    </div>
  );
}
