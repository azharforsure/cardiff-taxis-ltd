/**
 * Google Maps API loader and helpers.
 * Uses @googlemaps/js-api-loader v2 functional API (setOptions + importLibrary).
 */

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;
let mapsReady = false;

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function ensureOptions() {
  if (!initialized) {
    setOptions({
      key: API_KEY,
      v: "weekly",
      libraries: ["places", "geometry"],
    });
    initialized = true;
  }
}

/**
 * Load Google Maps and return the google namespace.
 * Safe to call multiple times — idempotent.
 */
export async function loadGoogleMaps(): Promise<typeof google> {
  if (mapsReady && window.google?.maps) {
    return window.google;
  }

  ensureOptions();

  // Import core libraries
  await importLibrary("maps");
  await importLibrary("places");
  await importLibrary("geometry");

  mapsReady = true;
  return window.google;
}

/**
 * Cardiff bounding box for location validation.
 * City Private Hire should only accept locations within Cardiff.
 */
export const CARDIFF_BOUNDS = {
  north: 51.58,
  south: 51.38,
  east: -3.0,
  west: -3.35,
};

/**
 * Check if a place is within (or near) Cardiff.
 * Uses both coordinate bounds and address string matching.
 */
export function isInCardiff(lat: number, lng: number, address?: string): boolean {
  // Check coordinates with generous bounds
  const inBounds =
    lat >= CARDIFF_BOUNDS.south &&
    lat <= CARDIFF_BOUNDS.north &&
    lng >= CARDIFF_BOUNDS.west &&
    lng <= CARDIFF_BOUNDS.east;

  if (inBounds) return true;

  // Fallback: check if the address mentions Cardiff or known Cardiff areas
  if (address) {
    const lower = address.toLowerCase();
    const cardiffKeywords = [
      "cardiff",
      "caerdydd",
      "penarth",
      "barry",
      "dinas powys",
      "llandaff",
      "pontprennau",
      "lisvane",
      "st mellons",
      "rumney",
      "splott",
      "roath",
      "canton",
      "grangetown",
      "butetown",
      "cathays",
      "tongwynlais",
      "radyr",
      "whitchurch",
      "rhiwbina",
      "heath",
      "llanishen",
      "cyncoed",
      "penylan",
      "cf10", "cf11", "cf14", "cf15", "cf23", "cf24", "cf3", "cf5",
    ];
    return cardiffKeywords.some((kw) => lower.includes(kw));
  }

  return false;
}

/**
 * Check if a place name/address contains a known airport.
 */
export function isAirportLocation(address: string): boolean {
  const airportKeywords = [
    "cardiff airport",
    "bristol airport",
    "heathrow",
    "gatwick",
    "stansted",
    "luton",
    "london city airport",
    "cwl",
    "brs",
    "lhr",
    "lgw",
    "stn",
    "ltn",
  ];
  const lower = address.toLowerCase();
  return airportKeywords.some((kw) => lower.includes(kw));
}

export interface PlaceResult {
  placeId: string;
  address: string;
  lat: number;
  lng: number;
}

/**
 * Calculate route between waypoints using the Directions API.
 */
export async function calculateRoute(
  origin: PlaceResult,
  destination: PlaceResult,
  waypoints: PlaceResult[] = []
): Promise<{
  distanceMeters: number;
  durationSeconds: number;
  route: google.maps.DirectionsResult | null;
} | null> {
  try {
    await loadGoogleMaps();
    const service = new google.maps.DirectionsService();
    
    const waypointsList = waypoints.map((wp) => ({
      location: { lat: wp.lat, lng: wp.lng },
      stopover: true,
    }));

    const result = await service.route({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      waypoints: waypointsList,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    });

    if (result.routes.length > 0) {
      let totalDistance = 0;
      let totalDuration = 0;

      for (const leg of result.routes[0].legs) {
        totalDistance += leg.distance?.value || 0;
        totalDuration += leg.duration?.value || 0;
      }

      return {
        distanceMeters: totalDistance,
        durationSeconds: totalDuration,
        route: result,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to calculate route:", error);
    return null;
  }
}
