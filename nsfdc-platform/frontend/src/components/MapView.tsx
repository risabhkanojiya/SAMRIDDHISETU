'use client';

import { useEffect, useRef } from 'react';

interface MapViewProps {
  accessToken?: string;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

export default function MapView({
  accessToken,
  center = [77.2090, 28.6139], // Default: New Delhi
  zoom = 11,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!accessToken || !mapContainerRef.current) return;

    // Dynamic import to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      (mapboxgl as any).accessToken = accessToken;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom,
      });

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // TODO: Fetch nearest partners and add markers
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [accessToken, center, zoom]);

  if (!accessToken) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Configure MAPBOX_ACCESS_TOKEN to enable the map.</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-xl overflow-hidden"
    />
  );
}
