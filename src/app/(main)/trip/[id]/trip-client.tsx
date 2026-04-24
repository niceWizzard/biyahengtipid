'use client';

import { Trip } from '@/db/types';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { useEffect, useMemo, useReducer, useState } from 'react';

import dynamic from 'next/dynamic';

import TripPanel from './_components/TripPanel';

import { TripActionType, tripReducer } from './trip-reducer';
import { toast } from 'sonner';
import { LocalTripStop } from './_components/TripStopItem';
import { fetchDirections } from '@/lib/mapbox';
import { useTransition } from 'react';
import { saveTripStopsAction } from '@/actions/trip';

export default function TripClient({
  trip,
  initialStops,
}: {
  trip: Trip;
  initialStops?: LocalTripStop[];
}) {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import('./_components/MapComponent'), {
        ssr: false,
        loading: () => (
          <div className="bg-background/50 flex h-full w-full items-center justify-center">
            Loading Map...
          </div>
        ),
      }),
    []
  );
  const [stops, dispatch] = useReducer(tripReducer, initialStops || []);
  const [navigationPath, setNavigationPath] = useState<
    [number, number][] | undefined
  >(undefined);
  const [isSaving, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await saveTripStopsAction(trip.id.toString(), stops);
        if (res.success && res.stops) {
          toast.success(res.message);
          dispatch({ type: TripActionType.SYNC_STOPS, payload: res.stops });
        } else {
          toast.error(res.message || 'Failed to save trip');
        }
      } catch (error) {
        console.error('Save error:', error);
        toast.error('An error occurred while saving.');
      }
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    async function updateDirections() {
      if (stops.length < 2) {
        setNavigationPath(undefined);
        return;
      }
      try {
        toast.loading('Finding path...', { id: 'nav-fetch' });
        const res = await fetchDirections({
          waypoints: stops.map((s) => [s.longitude, s.latitude]),
          signal: controller.signal,
        });
        const geom = res.routes[0].geometry.coordinates.map(
          (c) => [c[1], c[0]] as [number, number]
        );
        setNavigationPath(geom);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch navigation path:', error);
      } finally {
        toast.dismiss('nav-fetch');
      }
    }

    const timer = setTimeout(updateDirections, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [stops]);

  const handleDragEnd = (params: { activeId: string; overId: string }) => {
    dispatch({ type: TripActionType.REORDER_STOPS, payload: params });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: TripActionType.DELETE_STOP, payload: id });
  };
  const handleRename = (id: string, name: string) => {
    dispatch({ type: TripActionType.RENAME_STOP, payload: { id, name } });
  };

  return (
    <div className="bg-background relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden lg:flex-row">
      {/* Sidebar / List Panel */}
      <TripPanel
        trip={trip}
        onDelete={handleDelete}
        onRename={handleRename}
        onDragEnd={handleDragEnd}
        onSave={handleSave}
        isSaving={isSaving}
        stops={stops}
      />

      {/* Map Panel */}
      <div className="bg-muted/20 relative z-0 h-1/2 flex-1 lg:h-full">
        <MapComponent
          navigationPath={navigationPath}
          markers={stops}
          onMapClick={(lat, lng) => {
            if (stops.length >= 25) {
              toast.error('Maximum number of stops reached (25)');
              return;
            }
            dispatch({
              type: TripActionType.ADD_STOP,
              payload: {
                id: crypto.randomUUID(),
                latitude: lat,
                longitude: lng,
                name: new Date().toISOString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                tripId: trip.id,
                visitOrder: stops.length,
              },
            });
          }}
          onStopUpdateLocation={(id, latitude, longitude) => {
            dispatch({
              type: TripActionType.UPDATE_STOP_LOCATION,
              payload: { id, latitude, longitude },
            });
          }}
        />
      </div>
    </div>
  );
}
