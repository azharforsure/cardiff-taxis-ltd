export interface FleetClass {
  id: string;
  name: string;
  passengers: number;
  suitcases: number;
  image: string;
  typicalModels: string;
  description: string;
}

export const FLEET_CLASSES: FleetClass[] = [
  {
    id: "Saloon",
    name: "Saloon Car",
    passengers: 4,
    suitcases: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    typicalModels: "Skoda Superb, Toyota Prius, VW Passat",
    description: "Comfortable saloon car for individual travellers, couples, or small families.",
  },
  {
    id: "Estate",
    name: "Estate Car",
    passengers: 4,
    suitcases: 3,
    image: "/images/fleet_estate_new_1776975140733.png",
    typicalModels: "Toyota Corolla Touring, Skoda Octavia Estate",
    description: "Extra luggage space for airport transfers with extended boot.",
  },
  {
    id: "Executive",
    name: "Executive Saloon",
    passengers: 4,
    suitcases: 2,
    image: "/images/fleet_saloon_new_1776975126069.png",
    typicalModels: "Mercedes-Benz E-Class, BMW 5 Series",
    description: "Premium vehicle for corporate travel and luxury transfers.",
  },
  {
    id: "MPV",
    name: "People Carrier (6-Seater MPV)",
    passengers: 6,
    suitcases: 4,
    image: "/images/fleet_minibus_1776973773526.png",
    typicalModels: "Ford Tourneo Custom, VW Sharan",
    description: "Spacious MPV for family groups of up to 6 passengers.",
  },
  {
    id: "Minibus",
    name: "8-Seater Minibus",
    passengers: 8,
    suitcases: 7,
    image: "/images/about_taxi_new_1776975028206.png",
    typicalModels: "Mercedes-Benz Vito, Renault Trafic",
    description: "Spacious minibus for groups up to 8 passengers with 7 large suitcases.",
  },
];

export function getVehicleImage(type?: string): string {
  if (!type) return "/images/fleet_saloon_new_1776975126069.png";
  const lower = type.toLowerCase();
  if (lower.includes("estate")) return "/images/fleet_estate_new_1776975140733.png";
  if (lower.includes("minibus") || lower.includes("8") || lower.includes("van")) return "/images/about_taxi_new_1776975028206.png";
  if (lower.includes("mpv") || lower.includes("people") || lower.includes("carrier") || lower.includes("6")) return "/images/fleet_minibus_1776973773526.png";
  if (lower.includes("exec")) return "/images/fleet_saloon_new_1776975126069.png";
  return "/images/fleet_saloon_new_1776975126069.png";
}
