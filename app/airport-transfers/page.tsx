import type { Metadata } from "next";
import { AirportTransfers } from "../../src/views/AirportTransfers";

export const metadata: Metadata = {
  title: "Airport Transfers Cardiff | To Bristol, Heathrow, Gatwick & London",
  description:
    "Fixed-rate airport transfers from Cardiff to Bristol Airport, London Heathrow, Gatwick, Birmingham, and Stansted. 24/7 service with flight tracking and professional drivers.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/airport-transfers",
  },
  openGraph: {
    title: "Airport Transfers Cardiff | To Bristol, Heathrow & London",
    description:
      "Fixed-rate airport transfers from Cardiff to Bristol Airport, London Heathrow, Gatwick, Birmingham, and Stansted. 24/7 service with flight tracking and professional drivers.",
    url: "https://cardifftaxisltd.co.uk/airport-transfers",
    images: ["/images/airport_transfer_new_1776974974543.png"],
  },
};

const airportFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much is a taxi from Cardiff to Bristol Airport?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our taxi transfers from Cardiff to Bristol Airport start with fixed, competitive pricing based on vehicle choice. Instant quotes are available online without hidden fees.",
      },
    },
    {
      "@type": "Question",
      name: "How much is a taxi from Cardiff to Heathrow Airport?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cardiff Taxis Ltd provides reliable 24/7 transfers to London Heathrow (Terminals 2, 3, 4, and 5) with flight tracking and meet & greet options.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my flight is delayed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We monitor all incoming flights in real time using your flight number. Your driver's arrival time is adjusted automatically so they are waiting when you land.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide child car seats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, child seats and booster cushions are available on request when booking. You can also bring your own and we will safely store it for your return journey.",
      },
    },
  ],
};

export default function AirportTransfersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(airportFaqJsonLd) }}
      />
      <AirportTransfers />
    </>
  );
}
