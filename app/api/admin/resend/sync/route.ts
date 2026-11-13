import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { parseResendBookingText } from "@/lib/resend-parser";

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch recent emails list from Resend
    const res = await fetch("https://api.resend.com/emails", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Resend API returned ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const emails: any[] = json.data || [];

    // Filter to booking notification emails (skip test/verification emails)
    const bookingEmails = emails.filter((e) => {
      const sub = e.subject || "";
      return (
        (sub.includes("NEW PAID BOOKING") ||
          sub.includes("BOOKING RE-DELIVERY") ||
          sub.includes("Booking Confirmed")) &&
        !sub.includes("CTL-TEST")
      );
    });

    let syncedCount = 0;
    const syncedRefs: string[] = [];

    // 2. Fetch body for each email and upsert
    for (const item of bookingEmails) {
      try {
        const detailRes = await fetch(
          `https://api.resend.com/emails/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        if (!detailRes.ok) continue;

        const detail = await detailRes.json();
        const textContent = detail.text || "";
        const parsed = parseResendBookingText(
          textContent,
          detail.subject || item.subject,
          detail.created_at || item.created_at
        );

        if (parsed && parsed.bookingReference) {
          await prisma.booking.upsert({
            where: { bookingReference: parsed.bookingReference },
            update: {
              customerName: parsed.customerName,
              customerPhone: parsed.customerPhone,
              customerEmail: parsed.customerEmail,
              pickupAddress: parsed.pickupAddress,
              dropoffAddress: parsed.dropoffAddress,
              pickupDate: parsed.pickupDate,
              pickupTime: parsed.pickupTime,
              tripType: parsed.tripType,
              vehicleType: parsed.vehicleType,
              passengers: parsed.passengers,
              luggage: parsed.luggage,
              price: parsed.price,
              flightNumber: parsed.flightNumber,
              notes: parsed.notes,
            },
            create: parsed,
          });
          if (!syncedRefs.includes(parsed.bookingReference)) {
            syncedRefs.push(parsed.bookingReference);
            syncedCount++;
          }
        }
      } catch (err) {
        console.error(`Error syncing email ${item.id}:`, err);
      }
    }

    const totalInDb = await prisma.booking.count();

    return NextResponse.json({
      success: true,
      syncedCount,
      syncedRefs,
      totalInDb,
      message: `Successfully synced ${syncedCount} booking(s) from Resend.`,
    });
  } catch (err: any) {
    console.error("Resend sync error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to sync Resend bookings" },
      { status: 500 }
    );
  }
}
