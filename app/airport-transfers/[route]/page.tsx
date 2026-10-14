import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIRPORT_ROUTES, getRouteBySlug } from "../../../src/lib/routes-data";
import { VEHICLES, calculateFare } from "../../../src/lib/pricing";
import { Link } from "../../../src/components/ui/Link";
import { ArrowRight, Clock, MapPin, Plane, ShieldCheck, Users, Briefcase, Phone } from "lucide-react";

interface PageProps {
  params: Promise<{ route: string }>;
}

export async function generateStaticParams() {
  return AIRPORT_ROUTES.map((route) => ({
    route: route.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { route: slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    return {
      title: "Route Not Found",
    };
  }

  return {
    title: route.metaTitle,
    description: route.metaDescription,
    alternates: {
      canonical: `https://cardifftaxisltd.co.uk/airport-transfers/${route.slug}`,
    },
    openGraph: {
      title: route.metaTitle,
      description: route.metaDescription,
      url: `https://cardifftaxisltd.co.uk/airport-transfers/${route.slug}`,
      images: ["/images/airport_transfer_new_1776974974543.png"],
    },
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { route: slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: route.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cardifftaxisltd.co.uk/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Airport Transfers",
        item: "https://cardifftaxisltd.co.uk/airport-transfers",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: route.name,
        item: `https://cardifftaxisltd.co.uk/airport-transfers/${route.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex flex-col min-h-[70vh] pb-12">
        {/* Hero Header */}
        <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
          <div className="relative pt-[160px] pb-[100px] md:pt-[220px] md:pb-[140px] bg-brand-primary overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
              <img
                src="/images/airport_transfer_new_1776974974543.png"
                alt={route.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 z-10 bg-brand-primary/60 backdrop-blur-[2px] mix-blend-multiply"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent"></div>

            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 text-center">
              <span className="text-brand-accent text-[13px] md:text-[15px] font-bold tracking-[0.2em] uppercase mb-3 block">
                DIRECT AIRPORT TRANSFER
              </span>
              <h1 className="text-[28px] sm:text-[36px] md:text-[46px] lg:text-[52px] font-bold text-white mb-4 leading-[1.1] tracking-tight">
                {route.name} Taxi
              </h1>
              <p className="text-[15px] md:text-[17px] text-white/80 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                {route.overview}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white text-[14px] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  <span>{route.distanceMiles} Miles</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white text-[14px] font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  <span>{route.driveTime}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white text-[14px] font-semibold flex items-center gap-2">
                  <Plane className="w-4 h-4 text-brand-accent" />
                  <span>Flight Tracked</span>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/book?service=airport&dropoff=${encodeURIComponent(JSON.stringify({ address: `${route.airportName} (${route.airportCode})` }))}`}
                  className="inline-flex items-center justify-between gap-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-graphite font-bold text-[16px] h-[56px] px-2 pl-6 rounded-full hover:rounded-2xl transition-all shadow-lg group"
                >
                  Book This Transfer Online
                  <div className="w-10 h-10 rounded-full bg-brand-graphite flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
                <a
                  href="tel:07817385655"
                  className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[16px] h-[56px] px-8 rounded-full hover:rounded-2xl transition-all backdrop-blur-md"
                >
                  <Phone className="w-4 h-4" />
                  Call 07817 385655
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing for this specific route */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="text-center mb-10">
            <span className="text-brand-accent text-[13px] font-bold tracking-[0.2em] uppercase mb-2 block">
              TRANSPARENT FIXED PRICING
            </span>
            <h2 className="text-[26px] md:text-[34px] font-bold text-brand-graphite">
              Fares for {route.name}
            </h2>
            <p className="text-brand-muted text-[15px] font-semibold mt-2">
              Fixed rate based on your selected vehicle. No hidden tolls or surge charges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLES.map((vehicle) => {
              const fare = calculateFare(vehicle, route.distanceMiles, "airport");
              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-brand-graphite">
                        {vehicle.name}
                      </h3>
                      <span className="text-2xl font-extrabold text-brand-graphite">
                        £{fare}
                      </span>
                    </div>

                    <div className="aspect-[16/9] relative mb-4 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="object-contain w-full h-full p-2"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-[13px] font-semibold text-brand-graphite mb-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-brand-accent" />
                        Max {vehicle.maxPassengers}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-brand-accent" />
                        Max {vehicle.maxSuitcases} Suitcases
                      </span>
                    </div>

                    <p className="text-[13px] text-brand-muted mb-6 font-semibold">
                      {vehicle.description}
                    </p>
                  </div>

                  <Link
                    to={`/book?service=airport`}
                    className="w-full h-[48px] rounded-full bg-brand-primary text-white hover:bg-brand-graphite font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                  >
                    Select {vehicle.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Details & Pickup Information */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-section rounded-[24px] p-8">
              <h3 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-accent" />
                Route & Travel Information
              </h3>
              <ul className="flex flex-col gap-3 text-[14px] text-brand-graphite font-semibold">
                <li><strong>Typical Route:</strong> {route.motorway}</li>
                <li><strong>Estimated Distance:</strong> {route.distanceMiles} miles</li>
                <li><strong>Driving Time:</strong> {route.driveTime} (varies with peak traffic)</li>
                <li><strong>Drop-Off Point:</strong> {route.dropoffInfo}</li>
              </ul>
            </div>

            <div className="bg-brand-section rounded-[24px] p-8">
              <h3 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-accent" />
                Return & Flight Monitoring
              </h3>
              <p className="text-[14px] text-brand-graphite font-semibold leading-relaxed mb-4">
                {route.pickupInfo}
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-[13px] text-brand-muted font-semibold">
                  💡 <strong>Tip:</strong> Provide your flight number during booking so our driver can track any early arrivals or delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12">
          <h2 className="text-[26px] md:text-[32px] font-bold text-brand-graphite mb-8 text-center">
            Frequently Asked Questions: {route.name}
          </h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {route.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h4 className="text-[16px] font-bold text-brand-graphite mb-2">
                  {faq.q}
                </h4>
                <p className="text-[14px] text-brand-muted font-semibold leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
