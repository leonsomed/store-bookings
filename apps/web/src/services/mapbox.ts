import type { Map as TMap, Marker as TMarker } from 'mapbox-gl';
// @ts-ignore
import mapboxgl from '!mapbox-gl';
import { CONFIG } from '../services/config';

mapboxgl.accessToken = CONFIG.mapbox.publicKey;

export const Map = mapboxgl.Map as typeof TMap;
export const Marker = mapboxgl.Marker as typeof TMarker;

function DummyMap() {
  return new Map();
}

export type MapType = ReturnType<typeof DummyMap>;

export function getMapLink(coordinates: [number, number], zoom = 12) {
  return `http://maps.google.com/maps?q=loc:${coordinates[1]},${coordinates[0]}`;
}
