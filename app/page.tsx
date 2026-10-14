import type { Metadata } from "next";
import { Hero } from "../src/components/sections/Hero";
import { Features } from "../src/components/sections/Features";
import { About } from "../src/components/sections/About";
import { Pricing } from "../src/components/sections/Pricing";
import { Services } from "../src/components/sections/Services";
import { Process } from "../src/components/sections/Process";
import { Reviews } from "../src/components/sections/Reviews";
import { Faqs } from "../src/components/sections/Faqs";

export const metadata: Metadata = {
  title: "Cardiff Taxis Ltd | 24/7 Airport Transfers & Private Hire Cardiff",
  description:
    "Reliable 24/7 airport transfers from Cardiff to Bristol, Heathrow, Gatwick, and London airports. Fixed-rate quotes, flight tracking, and comfortable vehicles.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/",
  },
  openGraph: {
    title: "Cardiff Taxis Ltd | 24/7 Airport Transfers & Private Hire Cardiff",
    description:
      "Reliable 24/7 airport transfers from Cardiff to Bristol, Heathrow, Gatwick, and London airports. Fixed-rate quotes, flight tracking, and comfortable vehicles.",
    url: "https://cardifftaxisltd.co.uk/",
    images: ["/images/main-hero.png"],
  },
};

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far in advance should I book my airport transfer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend booking your transfer as early as possible. We can also handle short notice bookings if we have a vehicle available.",
      },
    },
    {
      "@type": "Question",
      name: "What are your rates for airport transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our rates are fixed depending on the car you choose. Please see our pricing list. You will not pay any extra hidden fees.",
      },
    },
    {
      "@type": "Question",
      name: "Do you monitor flight times for delays?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we track your flight using your flight number. If your flight is delayed or early, we alter the pickup time so a driver is always waiting for you.",
      },
    },
    {
      "@type": "Question",
      name: "What vehicles do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide Saloons, Estates, Executive cars, People Carriers, and 8-Seater minibuses. All our cars are clean, licensed, and comfortable.",
      },
    },
    {
      "@type": "Question",
      name: "Are you available for early morning and late night flights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our airport transfer service runs 24 hours a day, 7 days a week, 365 days a year.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <div className="flex flex-col">
        {/* Hero Card */}
        <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
          <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
            <Hero />
          </div>
        </div>

        <Features />

        {/* Process Card */}
        <div className="px-1 md:px-1.5 py-1 md:py-1.5">
          <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
            <Process />
          </div>
        </div>

        <Pricing />

        {/* Services Card */}
        <div className="px-1 md:px-1.5 py-1 md:py-1.5">
          <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
            <Services />
          </div>
        </div>

        <About />

        {/* Reviews Card */}
        <div className="px-1 md:px-1.5 py-1 md:py-1.5">
          <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-brand-graphite">
            <Reviews />
          </div>
        </div>

        <Faqs />
      </div>
    </>
  );
}
