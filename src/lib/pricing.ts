/**
 * Vehicle pricing engine for Cardiff Taxis Ltd.
 * Two rate structures:
 * - Private Hire: startPrice + (distanceMiles × perMile)
 * - Airport Transfers: firstMile + ((distanceMiles − 1) × perMileAirport)
 * Return journeys receive 5% discount on total.
 */

export type ServiceCategory = "city" | "airport";

export interface VehicleType {
  id: string;
  name: string;
  startPrice: number; // £ private-hire start price
  perMile: number; // £ per mile (private hire)
  firstMile: number; // £ first mile flat rate (airport)
  perMileAirport: number; // £ per mile after first mile (airport)
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
    startPrice: 35,
    perMile: 1.5,
    firstMile: 35,
    perMileAirport: 1.5,
    maxPassengers: 4,
    maxSuitcases: 2,
    maxHandCarry: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    description: "Comfortable saloon car for up to 4 passengers",
  },
  {
    id: "estate",
    name: "Estate",
    startPrice: 45,
    perMile: 1.6,
    firstMile: 45,
    perMileAirport: 1.6,
    maxPassengers: 4,
    maxSuitcases: 3,
    maxHandCarry: 3,
    image: "/images/fleet_estate_new_1776975140733.png",
    description: "Extra luggage space for families and groups (up to 3 suitcases)",
  },
  {
    id: "executive",
    name: "Executive",
    startPrice: 60,
    perMile: 1.8,
    firstMile: 60,
    perMileAirport: 1.8,
    maxPassengers: 4,
    maxSuitcases: 2,
    maxHandCarry: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    description: "Premium vehicle for business and comfort",
  },
  {
    id: "people_carrier",
    name: "People Carrier",
    startPrice: 50,
    perMile: 1.7,
    firstMile: 50,
    perMileAirport: 1.7,
    maxPassengers: 6,
    maxSuitcases: 4,
    maxHandCarry: 3,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Spacious MPV for up to 6 passengers",
  },
  {
    id: "executive_pc",
    name: "Executive People Carrier",
    startPrice: 60,
    perMile: 2.0,
    firstMile: 60,
    perMileAirport: 2.0,
    maxPassengers: 6,
    maxSuitcases: 4,
    maxHandCarry: 4,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Premium MPV with luxury comfort",
  },
  {
    id: "8_seater",
    name: "Minibus",
    startPrice: 60,
    perMile: 2.0,
    firstMile: 60,
    perMileAirport: 2.0,
    maxPassengers: 7,
    maxSuitcases: 7,
    maxHandCarry: 6,
    image: "/images/fleet_minibus_1776973773526.png",
    description: "Spacious minibus for groups up to 7 passengers with 7 suitcases",
  },
];

export const RETURN_DISCOUNT = 0.05; // 5% off for return journeys

/**
 * Calculate a one-way fare for a vehicle using first-mile + remaining miles rate.
 */
export function calculateFare(
  vehicle: VehicleType,
  distanceMiles: number,
  _category?: ServiceCategory,
): number {
  const remainingMiles = Math.max(0, distanceMiles - 1);
  const fare = vehicle.firstMile + remainingMiles * vehicle.perMileAirport;
  return Math.round(fare * 100) / 100;
}

/**
 * Calculate the fare for a return journey (5% discount on total).
 */
export function calculateReturnFare(
  vehicle: VehicleType,
  distanceMiles: number,
  category?: ServiceCategory,
): number {
  const oneWay = calculateFare(vehicle, distanceMiles, category);
  const total = oneWay * 2;
  const discounted = total * (1 - RETURN_DISCOUNT);
  return Math.round(discounted * 100) / 100;
}

/**
 * Get all vehicle quotes for a given distance.
 */
export function getAllQuotes(
  distanceMiles: number,
  isReturn: boolean,
  category?: ServiceCategory,
) {
  return VEHICLES.map((v) => ({
    vehicle: v,
    price: isReturn
      ? calculateReturnFare(v, distanceMiles, category)
      : calculateFare(v, distanceMiles, category),
    pricePerWay: calculateFare(v, distanceMiles, category),
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
