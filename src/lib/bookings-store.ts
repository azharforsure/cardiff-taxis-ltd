import fs from "fs";
import path from "path";
import prisma from "./prisma";

export interface BookingRecord {
  ref: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  vehicle: string;
  journeyType: "one_way" | "return";
  pickup: string;
  dropoff: string;
  stops?: { address: string }[];
  distanceMiles: number;
  durationSeconds: number;
  returnDate?: string;
  returnTime?: string;
  flightNumber?: string;
  returnFlightNumber?: string;
  returnArrivalTime?: string;
  luggage: string;
  passengers?: number;
  price: number;
  status: "PENDING_PAYMENT" | "PAID" | "FAILED";
  emailSent?: boolean;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllBookings(): BookingRecord[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error("Failed to read bookings file:", err);
    return [];
  }
}

export async function saveBookingAsync(booking: BookingRecord): Promise<void> {
  try {
    // 1. File cache update
    ensureDirectoryExists();
    const existing = getAllBookings();
    const index = existing.findIndex((b) => b.ref === booking.ref);

    if (index >= 0) {
      existing[index] = {
        ...existing[index],
        ...booking,
        updatedAt: new Date().toISOString(),
      };
    } else {
      existing.unshift({
        ...booking,
        updatedAt: new Date().toISOString(),
      });
    }

    const trimmed = existing.slice(0, 200);
    fs.writeFileSync(DATA_FILE, JSON.stringify(trimmed, null, 2), "utf-8");

    // 2. Direct MySQL persistence via Prisma (awaited so it is guaranteed)
    await prisma.booking.upsert({
      where: { bookingReference: booking.ref },
      update: {
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        pickupAddress: booking.pickup,
        dropoffAddress: booking.dropoff,
        pickupDate: booking.date,
        pickupTime: booking.time,
        isReturn: Boolean(booking.returnDate || booking.journeyType === "return"),
        returnDate: booking.returnDate || null,
        returnTime: booking.returnTime || null,
        tripType: booking.journeyType,
        vehicleType: booking.vehicle,
        passengers: booking.passengers || 1,
        luggage: parseInt(booking.luggage, 10) || 1,
        price: booking.price,
        flightNumber: booking.flightNumber || null,
        status: booking.status === "PAID" ? "CONFIRMED" : "PENDING",
        paymentStatus: booking.status === "PAID" ? "PAID" : "UNPAID",
        paymentId: booking.transactionId || null,
      },
      create: {
        bookingReference: booking.ref,
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        pickupAddress: booking.pickup,
        dropoffAddress: booking.dropoff,
        pickupDate: booking.date,
        pickupTime: booking.time,
        isReturn: Boolean(booking.returnDate || booking.journeyType === "return"),
        returnDate: booking.returnDate || null,
        returnTime: booking.returnTime || null,
        tripType: booking.journeyType,
        vehicleType: booking.vehicle,
        passengers: booking.passengers || 1,
        luggage: parseInt(booking.luggage, 10) || 1,
        price: booking.price,
        flightNumber: booking.flightNumber || null,
        source: "ONLINE",
        status: booking.status === "PAID" ? "CONFIRMED" : "PENDING",
        paymentStatus: booking.status === "PAID" ? "PAID" : "UNPAID",
        paymentMethod: "sumup",
        paymentId: booking.transactionId || null,
        createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
      },
    });
  } catch (err) {
    console.error("Failed to save booking to database:", err);
  }
}

export function saveBooking(booking: BookingRecord): void {
  saveBookingAsync(booking).catch((err) => {
    console.error("saveBooking async error:", err);
  });
}

export async function updateBookingStatusAsync(
  ref: string,
  status: "PENDING_PAYMENT" | "PAID" | "FAILED",
  meta?: { emailSent?: boolean; transactionId?: string }
): Promise<BookingRecord | null> {
  try {
    ensureDirectoryExists();
    const existing = getAllBookings();
    const index = existing.findIndex((b) => b.ref === ref);

    let updatedRecord: BookingRecord | null = null;
    if (index >= 0) {
      existing[index].status = status;
      if (meta?.emailSent !== undefined) {
        existing[index].emailSent = meta.emailSent;
      }
      if (meta?.transactionId) {
        existing[index].transactionId = meta.transactionId;
      }
      existing[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2), "utf-8");
      updatedRecord = existing[index];
    }

    // Await database status update
    await prisma.booking.updateMany({
      where: { bookingReference: ref },
      data: {
        status: status === "PAID" ? "CONFIRMED" : status === "FAILED" ? "CANCELLED" : "PENDING",
        paymentStatus: status === "PAID" ? "PAID" : "UNPAID",
        paymentId: meta?.transactionId || undefined,
      },
    });

    return updatedRecord;
  } catch (err) {
    console.error("Failed to update booking status in database:", err);
    return null;
  }
}

export function updateBookingStatus(
  ref: string,
  status: "PENDING_PAYMENT" | "PAID" | "FAILED",
  meta?: { emailSent?: boolean; transactionId?: string }
): BookingRecord | null {
  updateBookingStatusAsync(ref, status, meta).catch((err) => {
    console.error("updateBookingStatus async error:", err);
  });

  const existing = getAllBookings();
  const index = existing.findIndex((b) => b.ref === ref);
  return index >= 0 ? existing[index] : null;
}

export function getBooking(ref: string): BookingRecord | null {
  const existing = getAllBookings();
  return existing.find((b) => b.ref === ref) || null;
}
