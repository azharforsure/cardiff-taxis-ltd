import fs from "fs";
import path from "path";

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

export function saveBooking(booking: BookingRecord): void {
  try {
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

    // Keep the most recent 200 bookings
    const trimmed = existing.slice(0, 200);
    fs.writeFileSync(DATA_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save booking:", err);
  }
}

export function updateBookingStatus(
  ref: string,
  status: "PENDING_PAYMENT" | "PAID" | "FAILED",
  meta?: { emailSent?: boolean; transactionId?: string }
): BookingRecord | null {
  try {
    ensureDirectoryExists();
    const existing = getAllBookings();
    const index = existing.findIndex((b) => b.ref === ref);

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
      return existing[index];
    }
    return null;
  } catch (err) {
    console.error("Failed to update booking status:", err);
    return null;
  }
}

export function getBooking(ref: string): BookingRecord | null {
  const existing = getAllBookings();
  return existing.find((b) => b.ref === ref) || null;
}
