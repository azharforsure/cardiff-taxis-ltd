export interface ParsedBookingEmail {
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  isReturn: boolean;
  returnDate?: string | null;
  returnTime?: string | null;
  tripType: string;
  vehicleType: string;
  passengers: number;
  luggage: number;
  price: number;
  flightNumber?: string | null;
  source: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string;
  createdAt?: Date;
}

export function parseResendBookingText(
  text: string,
  subject: string,
  emailCreatedAt?: string
): ParsedBookingEmail | null {
  // Must have a reference
  const refMatch =
    text.match(/Reference:\s*(CTL-[A-Za-z0-9-]+)/i) ||
    subject.match(/(CTL-[A-Za-z0-9-]+)/i);
  if (!refMatch) return null;

  const bookingReference = refMatch[1].trim();

  // Price
  let price = 0;
  const priceMatch =
    text.match(/paid\s*£([0-9.]+)/i) ||
    subject.match(/£([0-9.]+)/) ||
    text.match(/£([0-9.]+)/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1]);
  }

  // Extract key-value blocks
  // Regex to match fields separated by label:
  const extractField = (label: string): string => {
    const regex = new RegExp(
      `${label}:\\s*([^\\n\\r]+?)(?=\\s+(?:Phone|Email|Service|Journey|Luggage|Pickup|Drop-off|Distance|Outbound|Return|Vehicle|Flight|Passengers|$))`,
      "i"
    );
    const m = text.match(regex);
    return m ? m[1].trim() : "";
  };

  const customerName =
    extractField("Customer") ||
    subject.replace(/.*-\s*/, "").replace(/\s*\(£.*?\).*/, "").trim() ||
    "Passenger";
  const customerPhone = extractField("Phone") || "N/A";
  const customerEmail = extractField("Email") || "N/A";
  const pickupAddress =
    extractField("Pickup") || "Cardiff Central, Cardiff, CF10";
  const dropoffAddress = extractField("Drop-off") || "Destination";

  // Outbound Date/Time: e.g. "2026-11-12 at 06:20" or "2026-11-16 at 05:45"
  const outboundRaw = extractField("Outbound Date/Time");
  let pickupDate = new Date().toISOString().split("T")[0];
  let pickupTime = "12:00";
  if (outboundRaw) {
    const parts = outboundRaw.split(/\s+at\s+/i);
    if (parts[0]) pickupDate = parts[0].trim();
    if (parts[1]) pickupTime = parts[1].trim();
  }

  const isReturn = /return/i.test(extractField("Journey"));
  const vehicleType = extractField("Vehicle") || "Saloon";
  const flightNumber = extractField("Flight") || null;

  // Luggage count
  const luggageStr = extractField("Luggage").toLowerCase();
  let luggage = 1;
  if (luggageStr.includes("none")) luggage = 0;
  else if (luggageStr.includes("hand")) luggage = 1;
  else if (luggageStr.includes("suitcases")) luggage = 2;

  // Dist / notes
  const dist = extractField("Distance/Duration");
  const notes = dist ? `Distance: ${dist}` : undefined;

  // Past dates are completed, future dates confirmed
  const tripDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
  const isPast = tripDateTime < new Date();
  const status = isPast ? "COMPLETED" : "CONFIRMED";

  return {
    bookingReference,
    customerName,
    customerPhone,
    customerEmail,
    pickupAddress,
    dropoffAddress,
    pickupDate,
    pickupTime,
    isReturn,
    tripType: isReturn ? "return" : "one-way",
    vehicleType,
    passengers: vehicleType.toLowerCase().includes("minibus") ? 8 : 4,
    luggage,
    price,
    flightNumber,
    source: "ONLINE",
    status,
    paymentStatus: "PAID",
    paymentMethod: "sumup",
    notes,
    createdAt: emailCreatedAt ? new Date(emailCreatedAt) : new Date(),
  };
}
