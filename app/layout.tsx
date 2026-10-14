import type { Metadata } from "next";
import Script from "next/script";
import "../src/index.css";
import { Navbar } from "../src/components/layout/Navbar";
import { Footer } from "../src/components/layout/Footer";
import { AirportButtons } from "../src/components/sections/AirportButtons";
import { AnalyticsTracker } from "../src/components/analytics/AnalyticsTracker";
import { GA_TRACKING_ID } from "../src/lib/gtag";

export const metadata: Metadata = {
  metadataBase: new URL("https://cardifftaxisltd.co.uk"),
  title: {
    default: "Cardiff Taxis Ltd | 24/7 Airport Transfers & Private Hire Cardiff",
    template: "%s | Cardiff Taxis Ltd",
  },
  description:
    "Cardiff Taxis Ltd provides reliable 24/7 airport transfers to Cardiff, Bristol, Heathrow, Gatwick, and London airports. Professional private hire service across Cardiff city with fixed rates and instant online booking.",
  keywords: [
    "cardiff taxi",
    "airport transfers cardiff",
    "cardiff to bristol airport taxi",
    "cardiff to heathrow taxi",
    "cardiff taxi booking",
    "private hire cardiff",
    "minibus hire cardiff",
    "executive taxi cardiff",
    "taxi service cardiff",
  ],
  authors: [{ name: "Cardiff Taxis Ltd" }],
  creator: "Cardiff Taxis Ltd",
  publisher: "Cardiff Taxis Ltd",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logoicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://cardifftaxisltd.co.uk",
    siteName: "Cardiff Taxis Ltd",
    title: "Cardiff Taxis Ltd | 24/7 Airport Transfers & Private Hire Cardiff",
    description:
      "Reliable 24/7 airport transfers from Cardiff to Bristol, Heathrow, Gatwick & all UK airports. Fixed prices, instant quotes, and executive vehicles.",
    images: [
      {
        url: "/images/main-hero.png",
        width: 1200,
        height: 630,
        alt: "Cardiff Taxis Ltd Fleet & Airport Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardiff Taxis Ltd | 24/7 Airport Transfers & Private Hire Cardiff",
    description:
      "Reliable 24/7 airport transfers from Cardiff to Bristol, Heathrow, Gatwick & all UK airports. Fixed prices and instant quotes.",
    images: ["/images/main-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["TaxiService", "LocalBusiness"],
  "name": "Cardiff Taxis Ltd",
  "image": "https://cardifftaxisltd.co.uk/images/main-hero.png",
  "@id": "https://cardifftaxisltd.co.uk",
  "url": "https://cardifftaxisltd.co.uk",
  "telephone": "+447817385655",
  "priceRange": "££",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cardiff",
    "addressRegion": "South Glamorgan",
    "addressCountry": "GB",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.4816,
    "longitude": -3.1791,
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    "opens": "00:00",
    "closes": "23:59",
  },
  "areaServed": [
    { "@type": "City", "name": "Cardiff" },
    { "@type": "City", "name": "Newport" },
    { "@type": "AdministrativeArea", "name": "Vale of Glamorgan" },
    { "@type": "Airport", "name": "Bristol Airport (BRS)" },
    { "@type": "Airport", "name": "London Heathrow Airport (LHR)" },
    { "@type": "Airport", "name": "London Gatwick Airport (LGW)" },
    { "@type": "Airport", "name": "Cardiff Airport (CWL)" },
    { "@type": "Airport", "name": "Birmingham Airport (BHX)" },
  ],
  "sameAs": ["https://wa.me/447817385655"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-brand-graphite selection:bg-brand-accent/30 relative overflow-x-hidden antialiased">
        <AnalyticsTracker />
        {/* Background base */}
        <div className="fixed inset-0 bg-brand-white z-[0]"></div>

        {/* Background Vertical Lines Overlay */}
        <div className="fixed inset-x-0 top-0 bottom-0 pointer-events-none hidden md:flex justify-center z-[1]">
          <div className="w-full max-w-[1400px] h-full px-[30px] relative">
            <div className="w-full h-full border-l border-r border-black/[0.08] relative"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>

          <div className="mt-4 mb-1">
            <AirportButtons />
          </div>

          {/* Footer Card */}
          <div className="px-1 md:px-1.5 pb-1 md:pb-1.5">
            <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05]">
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
