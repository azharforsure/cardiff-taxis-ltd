import type { Metadata } from "next";
import { Fleet } from "../../src/views/Fleet";

export const metadata: Metadata = {
  title: "Our Fleet & Pricing | Saloon, Estate, Executive & Minibus",
  description:
    "Explore the Cardiff Taxis Ltd vehicle fleet. Saloons, Estates (up to 3 suitcases), Executive cars, and 8-seater minibuses (up to 7 passengers, 7 suitcases). Transparent fixed pricing.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/fleet",
  },
  openGraph: {
    title: "Our Fleet & Pricing | Cardiff Taxis Ltd",
    description:
      "Explore our range of licensed vehicles in Cardiff: Saloons, Estates, Executive Chauffeurs, and 8-seater Minibuses. Clean, comfortable, and reliable.",
    url: "https://cardifftaxisltd.co.uk/fleet",
    images: ["/images/fleet_minibus_1776973773526.png"],
  },
};

export default function FleetPage() {
  return <Fleet />;
}
