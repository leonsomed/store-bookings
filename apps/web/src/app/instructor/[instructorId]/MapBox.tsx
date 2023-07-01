'use client';

import { useEffect, useRef } from 'react';
import { Map, MapType, Marker } from '../../../services/mapbox';

interface MapBoxProps {
  className?: string;
  center: [number, number];
  geojson?: {
    type: string;
    coordinates: number[][][];
  };
}

export function MapBox({ className, center, geojson }: MapBoxProps) {
  const mapContainerRef = useRef<HTMLDivElement>();
  const mapRef = useRef<MapType>();

  useEffect(() => {
    const map = new Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom: 5,
    });

    if (geojson) {
      map.on('load', () => {
        map.addSource('isochrone', {
          type: 'geojson',
          data: {
            type: 'Feature',
            // @ts-ignore
            geometry: geojson,
            properties: {
              title: 'Mapbox DC',
              'marker-symbol': 'monument',
            },
          },
        });

        // Add a new layer to visualize the polygon.
        map.addLayer({
          id: 'isochrone',
          type: 'fill',
          source: 'isochrone', // reference the data source
          layout: {},
          paint: {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5,
          },
        });
        // Add a black outline around the polygon.
        map.addLayer({
          id: 'outline',
          type: 'line',
          source: 'isochrone',
          layout: {},
          paint: {
            'line-color': '#000',
            'line-width': 3,
          },
        });
      });
    }

    const marker = new Marker().setLngLat(center).addTo(map);

    mapRef.current = map;

    return () => {
      marker.remove();
      map.remove();
    };
  }, []);

  return <div className={className} ref={mapContainerRef} />;
}
