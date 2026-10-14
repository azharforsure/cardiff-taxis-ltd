export interface AirportRoute {
  slug: string;
  name: string;
  airportName: string;
  airportCode: string;
  distanceMiles: number;
  driveTime: string;
  motorway: string;
  overview: string;
  pickupInfo: string;
  dropoffInfo: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ q: string; a: string }>;
}

export const AIRPORT_ROUTES: AirportRoute[] = [
  {
    slug: "cardiff-to-bristol-airport",
    name: "Cardiff to Bristol Airport",
    airportName: "Bristol Airport",
    airportCode: "BRS",
    distanceMiles: 48,
    driveTime: "50 – 60 minutes",
    motorway: "M4 & M49 via Prince of Wales Bridge",
    overview:
      "Bristol Airport is the most popular departure hub for travelers in Cardiff and South Wales. Cardiff Taxis Ltd provides reliable, fixed-rate transfers operating 24 hours a day, 7 days a week.",
    pickupInfo:
      "For return pickups, our driver will monitor your flight number and meet you at the official Bristol Airport Express Drop Off / Pick Up zone or Arrivals concourse.",
    dropoffInfo:
      "Direct drop-off right outside the main terminal entrance with assistance unloading your luggage.",
    metaTitle: "Cardiff to Bristol Airport Taxi | Fixed Fares & 24/7 Transfers",
    metaDescription:
      "Book a reliable 24/7 taxi transfer from Cardiff to Bristol Airport (BRS). Fixed fares, flight delay monitoring, and comfortable Saloon, Estate, and Minibus options.",
    faqs: [
      {
        q: "How long does a taxi take from Cardiff to Bristol Airport?",
        a: "The drive takes approximately 50 to 60 minutes via the M4 and Prince of Wales Bridge depending on traffic.",
      },
      {
        q: "What if my flight into Bristol Airport is delayed?",
        a: "We actively track your inbound flight using your flight number. Your driver adjusts their arrival so you won't incur waiting fees for standard delays.",
      },
      {
        q: "Can I book a minibus for group travel to Bristol Airport?",
        a: "Yes! Our 8-seater minibuses accommodate up to 7 passengers with 7 large suitcases, keeping your entire party together.",
      },
    ],
  },
  {
    slug: "cardiff-to-heathrow-airport",
    name: "Cardiff to London Heathrow Airport",
    airportName: "London Heathrow Airport",
    airportCode: "LHR",
    distanceMiles: 135,
    driveTime: "2 hours 15 minutes",
    motorway: "M4 direct to Terminals 2, 3, 4 & 5",
    overview:
      "Connecting Cardiff with the UK's busiest international gateway. Avoid crowded trains and stressful connections with our private, door-to-door Heathrow chauffeur service.",
    pickupInfo:
      "Your driver will track your landing time and contact you as soon as you touch down, coordinating meet and greet at your terminal's designated pickup area.",
    dropoffInfo:
      "Seamless drop-off directly at your terminal's departures ramp (Terminal 2, 3, 4, or 5).",
    metaTitle: "Cardiff to Heathrow Taxi | 24/7 Transfers to All Terminals (T2, T3, T4, T5)",
    metaDescription:
      "Direct, comfortable airport taxi from Cardiff to London Heathrow Airport (LHR). Fixed prices, free flight tracking, child seats on request, and executive travel.",
    faqs: [
      {
        q: "How far is Cardiff from London Heathrow Airport?",
        a: "The distance is approximately 135 miles via the M4 motorway, with a typical journey time of 2 hours and 15 minutes.",
      },
      {
        q: "Which Heathrow terminals do you service?",
        a: "We provide transfers to and from all Heathrow terminals: Terminal 2, Terminal 3, Terminal 4, and Terminal 5.",
      },
      {
        q: "Are return journey discounts available?",
        a: "Yes, all round-trip bookings receive an automatic 5% discount on the total fare.",
      },
    ],
  },
  {
    slug: "cardiff-to-gatwick-airport",
    name: "Cardiff to London Gatwick Airport",
    airportName: "London Gatwick Airport",
    airportCode: "LGW",
    distanceMiles: 165,
    driveTime: "2 hours 45 minutes",
    motorway: "M4 and M25 to South & North Terminals",
    overview:
      "Comfortable long-distance transfers between Cardiff, South Wales, and London Gatwick Airport. Enjoy spacious seating, climate control, and experienced drivers.",
    pickupInfo:
      "Driver monitors flight status in real-time and meets you at Gatwick North or South terminal designated pickup zones.",
    dropoffInfo:
      "Drop-off directly at the designated departures drop-off lanes for North or South terminals.",
    metaTitle: "Cardiff to Gatwick Airport Taxi | North & South Terminal Transfers",
    metaDescription:
      "Fixed-price transfers between Cardiff and London Gatwick Airport (LGW). 24/7 private hire service with clean vehicles and generous luggage capacity.",
    faqs: [
      {
        q: "How long does a transfer from Cardiff to Gatwick take?",
        a: "The journey is around 165 miles and takes approximately 2 hours 45 minutes to 3 hours depending on M25 traffic.",
      },
      {
        q: "Do you operate early morning pickups in Cardiff for Gatwick flights?",
        a: "Yes, our service operates 24/7, including early morning departures (3:00 AM, 4:00 AM) to catch morning flights.",
      },
    ],
  },
  {
    slug: "cardiff-to-birmingham-airport",
    name: "Cardiff to Birmingham Airport",
    airportName: "Birmingham Airport",
    airportCode: "BHX",
    distanceMiles: 115,
    driveTime: "2 hours",
    motorway: "M4 and M5 / M42",
    overview:
      "Direct airport taxi from Cardiff to Birmingham Airport (BHX). Perfect for charter flights, holiday packages, and European business travel.",
    pickupInfo:
      "Meet and greet at the Birmingham Airport passenger arrival pickup zone.",
    dropoffInfo:
      "Curbside drop-off right outside departures terminal.",
    metaTitle: "Cardiff to Birmingham Airport Taxi | Fixed Fares & 24/7 Private Hire",
    metaDescription:
      "Book an airport transfer from Cardiff to Birmingham Airport (BHX). Fixed pricing, flight delay tracking, and comfortable Saloons, Estates, and Minibuses.",
    faqs: [
      {
        q: "What is the driving time from Cardiff to Birmingham Airport?",
        a: "It typically takes 1 hour 50 minutes to 2 hours via the M4 and M5.",
      },
    ],
  },
  {
    slug: "cardiff-to-cardiff-airport",
    name: "Cardiff to Cardiff Wales Airport",
    airportName: "Cardiff Airport",
    airportCode: "CWL",
    distanceMiles: 14,
    driveTime: "25 – 30 minutes",
    motorway: "A4232 and A4050 / Port Road to Rhoose",
    overview:
      "Fast, dependable local taxi service to Cardiff Wales Airport (CWL) in Rhoose from Cardiff City Centre, Cardiff Bay, Penarth, Newport, and across South Wales.",
    pickupInfo:
      "Driver meets you at the Cardiff Airport arrival exit terminal.",
    dropoffInfo:
      "Drop-off right outside the main departure terminal doors.",
    metaTitle: "Cardiff to Cardiff Airport Taxi (CWL) | Local Rhoose Airport Transfers",
    metaDescription:
      "Reliable local taxi transfers from Cardiff City Centre & South Wales to Cardiff Airport in Rhoose (CWL). Prompt 24/7 dispatch.",
    faqs: [
      {
        q: "How long does it take from Cardiff City Centre to Cardiff Airport?",
        a: "Under normal traffic conditions, the drive takes between 25 and 30 minutes.",
      },
    ],
  },
  {
    slug: "cardiff-to-manchester-airport",
    name: "Cardiff to Manchester Airport",
    airportName: "Manchester Airport",
    airportCode: "MAN",
    distanceMiles: 175,
    driveTime: "3 hours 15 minutes",
    motorway: "M4, M5, and M6 to Terminals 1, 2 & 3",
    overview:
      "Convenient long-distance private hire transfer connecting Cardiff and South Wales with Manchester Airport. No train transfers or heavy luggage dragging.",
    pickupInfo:
      "Flight tracked pickup outside your arrival terminal at Manchester Airport.",
    dropoffInfo:
      "Direct drop-off at Terminal 1, 2, or 3 departure areas.",
    metaTitle: "Cardiff to Manchester Airport Taxi | Long Distance Transfers",
    metaDescription:
      "Direct private hire airport taxi between Cardiff and Manchester Airport (MAN). Reliable 24/7 service with fixed pricing.",
    faqs: [
      {
        q: "How far is Manchester Airport from Cardiff?",
        a: "It is approximately 175 miles via the M50 and M6, taking around 3 hours 15 minutes.",
      },
    ],
  },
  {
    slug: "cardiff-to-stansted-airport",
    name: "Cardiff to London Stansted Airport",
    airportName: "London Stansted Airport",
    airportCode: "STN",
    distanceMiles: 185,
    driveTime: "3 hours 15 minutes",
    motorway: "M4, M25 and M11",
    overview:
      "Long-distance private transfers connecting Cardiff with London Stansted Airport (STN). Ideal for European flights with Ryanair and Jet2.",
    pickupInfo:
      "Designated pickup zone at the Stansted terminal exit with driver flight tracking.",
    dropoffInfo:
      "Departures drop-off forecourt.",
    metaTitle: "Cardiff to Stansted Airport Taxi | Fixed Fares | Cardiff Taxis Ltd",
    metaDescription:
      "Private hire transfers from Cardiff to London Stansted Airport (STN). Fixed rates, modern vehicles, and 24/7 availability.",
    faqs: [
      {
        q: "What is the journey time to Stansted from Cardiff?",
        a: "Approx. 3 hours 15 minutes to 3 hours 30 minutes via the M4 and M25.",
      },
    ],
  },
  {
    slug: "cardiff-to-luton-airport",
    name: "Cardiff to London Luton Airport",
    airportName: "London Luton Airport",
    airportCode: "LTN",
    distanceMiles: 150,
    driveTime: "2 hours 35 minutes",
    motorway: "M4, M25 and M1",
    overview:
      "Door-to-door private airport taxi between Cardiff and London Luton Airport (LTN). Fixed rates with no surge pricing.",
    pickupInfo:
      "Pickup from Luton Airport Mid Stay / Express pickup point with flight monitoring.",
    dropoffInfo:
      "Drop-off right at the terminal forecourt.",
    metaTitle: "Cardiff to Luton Airport Taxi | 24/7 Transfers | Cardiff Taxis Ltd",
    metaDescription:
      "Reliable airport transfers from Cardiff to London Luton Airport (LTN). Fixed quotes and round-the-clock availability.",
    faqs: [
      {
        q: "How long does it take from Cardiff to Luton Airport?",
        a: "Usually around 2 hours 35 minutes via the M4 and M1.",
      },
    ],
  },
];

export function getRouteBySlug(slug: string): AirportRoute | undefined {
  return AIRPORT_ROUTES.find((r) => r.slug === slug);
}
