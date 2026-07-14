import { create } from 'zustand';
import type { GeoPosition, GeoStatus } from '../types';

// Placeholder office coordinates — will be updated later
const OFFICE_LAT = 40.0;
const OFFICE_LNG = 29.0;
const GEOFENCE_RADIUS_M = 50;

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface GeoState {
  status: GeoStatus;
  position: GeoPosition | null;
  distance: number | null; // meters from office
  isWithinRange: boolean;
  errorMessage: string | null;
  requestLocation: () => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  status: 'idle',
  position: null,
  distance: null,
  isWithinRange: false,
  errorMessage: null,

  requestLocation: () => {
    if (!('geolocation' in navigator)) {
      set({ status: 'unavailable', errorMessage: 'Geolocation not supported' });
      return;
    }

    set({ status: 'requesting' });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const dist = haversineDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
        const withinRange = dist <= GEOFENCE_RADIUS_M;

        set({
          status: 'granted',
          position: { latitude, longitude, accuracy },
          distance: Math.round(dist),
          isWithinRange: withinRange,
          errorMessage: null,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            set({ status: 'denied', errorMessage: 'Permission denied' });
            break;
          case err.POSITION_UNAVAILABLE:
            set({ status: 'unavailable', errorMessage: 'Position unavailable' });
            break;
          case err.TIMEOUT:
            set({ status: 'error', errorMessage: 'Request timed out' });
            break;
          default:
            set({ status: 'error', errorMessage: 'Unknown error' });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  },
}));
