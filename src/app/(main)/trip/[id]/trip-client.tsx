'use client';

import { Trip } from '@/db/types';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { useEffect, useMemo, useReducer, useState } from 'react';

import dynamic from 'next/dynamic';

import TripPanel from './_components/TripPanel';

import { TripActionType, tripReducer } from './trip-reducer';
import { toast } from 'sonner';
import { StopData } from './_components/TripStopItem';
import { fetchDirections } from '@/lib/mapbox';

export default function TripClient({
  trip,
  initialStops,
}: {
  trip: Trip;
  initialStops?: StopData[];
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

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (stops.length < 2) {
        setNavigationPath(undefined);
        return;
      }
      try {
        const res = await fetchDirections({
          waypoints: stops.map((s) => [s.lng, s.lat]),
          signal: controller.signal,
        });
        const geom = res.routes[0].geometry.coordinates.map(
          (c) => [c[1], c[0]] as [number, number]
        );
        setNavigationPath(geom);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch navigation path:', error);
      }
    }, 500);

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
    <div className="bg-background flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden lg:flex-row">
      {/* Sidebar / List Panel */}
      <TripPanel
        trip={trip}
        onDelete={handleDelete}
        onRename={handleRename}
        onDragEnd={handleDragEnd}
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
                lat,
                lng,
                name: new Date().toISOString(),
              },
            });
          }}
          onStopUpdateLocation={(id, lat, lng) => {
            dispatch({
              type: TripActionType.UPDATE_STOP_LOCATION,
              payload: { id, lat, lng },
            });
          }}
        />
      </div>
    </div>
  );
}
