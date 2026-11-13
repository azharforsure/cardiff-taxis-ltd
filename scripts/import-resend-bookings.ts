import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const historicalBookings = [
  {
    bookingReference: "CTL-20261105-65BK59",
    customerName: "Marlene Tichy",
    customerEmail: "marlene.tichy@icloud.com",
    customerPhone: "07414087078",
    pickupAddress: "Cardiff University Centre for Student Life, Park Place, CF10 3BB",
    dropoffAddress: "Bristol Airport, BS48 3DY",
    pickupDate: "2026-11-12",
    pickupTime: "12:05",
    isReturn: false,
    tripType: "one-way",
    vehicleType: "Saloon",
    passengers: 1,
    luggage: 1,
    price: 108.05,
    source: "ONLINE",
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "sumup",
    notes: "Imported from Resend booking confirmation (Distance: 49.7 miles, 1h 12min).",
    createdAt: new Date("2026-11-05T16:22:14.000Z"),
  },
  {
    bookingReference: "CTL-20261109-NOGQ50",
    customerName: "Ruth Pengelly",
    customerEmail: "ruthie.p@live.co.uk",
    customerPhone: "07834633643",
    pickupAddress: "2 Maes-Y-Nant, Cardiff, CF15 9EJ",
    dropoffAddress: "Cardiff Airport, Barry, CF62 3BD",
    pickupDate: "2026-11-16",
    pickupTime: "05:45",
    isReturn: false,
    tripType: "one-way",
    vehicleType: "Saloon",
    passengers: 1,
    luggage: 2,
    price: 53.0,
    flightNumber: "FR635",
    source: "ONLINE",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentMethod: "sumup",
    notes: "Imported from Resend booking confirmation (Flight: FR635, Distance: 13 miles, 28 min).",
    createdAt: new Date("2026-11-09T20:51:51.000Z"),
  },
  {
    bookingReference: "CTL-20261111-H21KZA",
    customerName: "Muhammad Sikander Ijaz Ahmad",
    customerEmail: "msi786@hotmail.com",
    customerPhone: "07817385655",
    pickupAddress: "CF24 0AB, Newport Road, Cardiff, CF24 0AB",
    dropoffAddress: "CF24 0AA, Newport Road, Cardiff, CF24 0AA",
    pickupDate: "2026-11-12",
    pickupTime: "06:20",
    isReturn: false,
    tripType: "one-way",
    vehicleType: "Saloon",
    passengers: 1,
    luggage: 0,
    price: 35.0,
    source: "ONLINE",
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "sumup",
    notes: "Imported from Resend booking confirmation (Distance: 0.1 miles).",
    createdAt: new Date("2026-11-11T09:32:32.000Z"),
  },
];

async function main() {
  console.log("Starting Resend booking sync into Hostinger MySQL...");
  for (const b of historicalBookings) {
    const upserted = await prisma.booking.upsert({
      where: { bookingReference: b.bookingReference },
      update: b,
      create: b,
    });
    console.log(
      `✓ Upserted: ${upserted.bookingReference} | ${upserted.customerName} | £${upserted.price.toFixed(2)} | Date: ${upserted.pickupDate} ${upserted.pickupTime}`
    );
  }
  const total = await prisma.booking.count();
  console.log(`\nSync finished. Total bookings in MySQL database: ${total}`);
}

main()
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
