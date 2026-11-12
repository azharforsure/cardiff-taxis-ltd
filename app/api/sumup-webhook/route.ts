import { NextResponse } from "next/server";
import { getAllBookings, updateBookingStatus } from "../../../src/lib/bookings-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("SumUp Webhook received:", JSON.stringify(body));

    const eventType = body.event_type;
    const checkoutId = body.id;
    const status = body.status;

    if (eventType === "CHECKOUT_STATUS_CHANGED" && status === "PAID") {
      // Find the booking matching this checkout ID or reference
      const all = getAllBookings();
      const booking = all.find(
        (b) => b.transactionId === checkoutId || b.ref === body.checkout_reference
      );

      if (booking) {
        updateBookingStatus(booking.ref, "PAID", { transactionId: checkoutId });

        // If email hasn't been sent yet, trigger server-side dispatch
        if (!booking.emailSent && process.env.RESEND_API_KEY) {
          const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bookings@cardifftaxisltd.co.uk";

          const adminHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #22c55e; border-radius: 10px; padding: 20px;">
              <h2>🚨 NEW PAID BOOKING (VIA SUMUP WEBHOOK)</h2>
              <p>Reference: <strong>${booking.ref}</strong></p>
              <p>The customer has paid <strong>£${booking.price.toFixed(2)}</strong> via SumUp.</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td><strong>Customer:</strong></td><td>${booking.name}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${booking.phone}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${booking.email}</td></tr>
                <tr><td><strong>Pickup:</strong></td><td>${booking.pickup}</td></tr>
                <tr><td><strong>Drop-off:</strong></td><td>${booking.dropoff}</td></tr>
                <tr><td><strong>Date/Time:</strong></td><td>${booking.date} at ${booking.time}</td></tr>
                ${booking.returnDate ? `<tr><td><strong>Return:</strong></td><td>${booking.returnDate} at ${booking.returnTime || ""}</td></tr>` : ""}
              </table>
            </div>
          `;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Cardiff Taxis LTD <bookings@cardifftaxisltd.co.uk>",
              to: ADMIN_EMAIL,
              subject: `🚨 NEW PAID BOOKING: ${booking.ref} - ${booking.name} (£${booking.price.toFixed(2)})`,
              html: adminHtml,
            }),
          }).catch((e) => console.error("Webhook email dispatch error:", e));

          updateBookingStatus(booking.ref, "PAID", { emailSent: true });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ received: false, error: err.message }, { status: 500 });
  }
}
