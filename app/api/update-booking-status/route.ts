import { NextResponse } from "next/server";
import { updateBookingStatus } from "../../../src/lib/bookings-store";

export async function POST(req: Request) {
  try {
    const { ref, status, transactionId, emailSent } = await req.json();

    if (!ref || !status) {
      return NextResponse.json({ error: "Missing ref or status" }, { status: 400 });
    }

    const updated = updateBookingStatus(ref, status, { transactionId, emailSent });
    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error("Error updating booking status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
