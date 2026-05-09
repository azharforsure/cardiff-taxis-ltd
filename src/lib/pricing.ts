/**
 * Vehicle pricing engine for Cardiff Taxis Ltd.
 * Pricing formula: Start Price + (Distance in miles × Per Mile Rate)
 * Return journeys receive 5% discount on total.
 */

export interface VehicleType {
  id: string;
  name: string;
  startPrice: number; // £
  perMile: number; // £ per mile
  maxPassengers: number;
  maxSuitcases: number;
  maxHandCarry: number;
  image: string;
  description: string;
}

export const VEHICLES: VehicleType[] = [
  {
    id: "saloon",
    name: "Saloon",
    startPrice: 4,
    perMile: 2.5,
    maxPassengers: 4,
    maxSuitcases: 2,
    maxHandCarry: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    description: "Comfortable saloon car for up to 4 passengers",
  },
  {
    id: "estate",
    name: "Estate",
    startPrice: 8,
    perMile: 2.5,
    maxPassengers: 4,
    maxSuitcases: 4,
    maxHandCarry: 3,
    image: "/images/fleet_estate_new_1776975140733.png",
    description: "Extra luggage space for families and groups",
  },
  {
    id: "executive",
    name: "Executive",
    startPrice: 8,
    perMile: 3,
    maxPassengers: 4,
    maxSuitcases: 2,
    maxHandCarry: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    description: "Premium vehicle for business and comfort",
  },
  {
    id: "people_carrier",
    name: "People Carrier",
    startPrice: 10,
    perMile: 3,
    maxPassengers: 6,
    maxSuitcases: 4,
    maxHandCarry: 3,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Spacious MPV for up to 6 passengers",
  },
  {
    id: "executive_pc",
    name: "Executive People Carrier",
    startPrice: 15,
    perMile: 3,
    maxPassengers: 6,
    maxSuitcases: 6,
    maxHandCarry: 4,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Premium MPV with luxury comfort",
  },
  {
    id: "8_seater",
    name: "8-Seater Minibus",
    startPrice: 12,
    perMile: 3,
    maxPassengers: 8,
    maxSuitcases: 8,
    maxHandCarry: 6,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Large minibus for groups up to 8",
  },
];

export const RETURN_DISCOUNT = 0.05; // 5% off for return journeys

/**
 * Calculate the fare for a one-way journey.
 */
export function calculateFare(vehicle: VehicleType, distanceMiles: number): number {
  const fare = vehicle.startPrice + distanceMiles * vehicle.perMile;
  return Math.round(fare * 100) / 100; // round to 2dp
}

/**
 * Calculate the fare for a return journey (5% discount on total).
 */
export function calculateReturnFare(vehicle: VehicleType, distanceMiles: number): number {
  const oneWay = calculateFare(vehicle, distanceMiles);
  const total = oneWay * 2;
  const discounted = total * (1 - RETURN_DISCOUNT);
  return Math.round(discounted * 100) / 100;
}

/**
 * Get all vehicle quotes for a given distance.
 */
export function getAllQuotes(distanceMiles: number, isReturn: boolean) {
  return VEHICLES.map((v) => ({
    vehicle: v,
    price: isReturn
      ? calculateReturnFare(v, distanceMiles)
      : calculateFare(v, distanceMiles),
    pricePerWay: calculateFare(v, distanceMiles),
  }));
}

/**
 * Convert meters to miles.
 */
export function metersToMiles(meters: number): number {
  return Math.round((meters / 1609.344) * 10) / 10;
}

/**
 * Format duration from seconds to human readable.
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
}
