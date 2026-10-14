import type { Metadata } from "next";
import { BookingPageClient } from "../../src/components/booking/BookingPageClient";

export const metadata: Metadata = {
  title: "Book a Taxi Cardiff | Instant Quote & Online Booking",
  description:
    "Book your Cardiff taxi or airport transfer online. Get an instant quote with route map, choose your vehicle, and confirm in minutes. Fixed prices and secure online payment.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/book",
  },
  openGraph: {
    title: "Book a Taxi Cardiff | Instant Quote & Online Booking",
    description:
      "Get an instant fixed-price quote and book your Cardiff taxi or airport transfer online in minutes. Safe, licensed, and reliable.",
    url: "https://cardifftaxisltd.co.uk/book",
    images: ["/images/service_detail_header_1776973788710.png"],
  },
};

export default function BookPage() {
  return <BookingPageClient />;
}
