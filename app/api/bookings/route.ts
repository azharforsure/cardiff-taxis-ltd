import { NextResponse } from "next/server";
import { getAllBookings } from "../../../src/lib/bookings-store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const bookings = getAllBookings();
    const url = new URL(req.url);
    const format = url.searchParams.get("format");
    const accept = req.headers.get("accept") || "";

    // If API client asks for JSON explicitly
    if (format === "json" || (!accept.includes("text/html") && accept.includes("application/json"))) {
      return NextResponse.json({ success: true, count: bookings.length, bookings });
    }

    // Otherwise render clean, mobile-friendly dashboard for the owner
    const cardsHtml = bookings.length === 0
      ? `<div style="text-align: center; padding: 40px; color: #888;">No bookings recorded yet.</div>`
      : bookings.map((b) => {
          const isPaid = b.status === "PAID";
          const statusBg = isPaid ? "#dcfce7" : "#fef9c3";
          const statusColor = isPaid ? "#15803d" : "#854d0e";
          const statusText = isPaid ? "✅ PAID" : "⏳ PENDING / IN PROGRESS";

          return `
            <div style="background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 18px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">
                <div>
                  <span style="font-size: 13px; font-weight: bold; color: #111;">Ref: ${b.ref}</span>
                  <div style="font-size: 11px; color: #6b7280;">${new Date(b.createdAt).toLocaleString("en-GB")}</div>
                </div>
                <div style="background: ${statusBg}; color: ${statusColor}; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px;">
                  ${statusText}
                </div>
              </div>

              <div style="margin-bottom: 12px;">
                <div style="font-size: 16px; font-weight: bold; color: #111; margin-bottom: 4px;">${b.name || "Customer"}</div>
                <div style="font-size: 14px; color: #4b5563; display: flex; gap: 12px; flex-wrap: wrap;">
                  <a href="tel:${b.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">📞 ${b.phone}</a>
                  <a href="mailto:${b.email}" style="color: #4b5563; text-decoration: none;">✉️ ${b.email}</a>
                </div>
              </div>

              <div style="background: #f9fafb; border-radius: 10px; padding: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.5;">
                <div style="margin-bottom: 6px;">
                  <strong style="color: #059669;">📍 Pickup:</strong> ${b.pickup}
                </div>
                <div style="margin-bottom: 6px;">
                  <strong style="color: #dc2626;">🏁 Drop-off:</strong> ${b.dropoff}
                </div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 6px;">
                  <strong>📅 Outbound:</strong> <span style="font-weight: bold; color: #111;">${b.date} at ${b.time}</span>
                  ${b.flightNumber ? ` (Flight: ${b.flightNumber})` : ""}
                </div>
                ${b.returnDate ? `
                  <div style="margin-top: 4px; color: #1d4ed8;">
                    <strong>🔁 Return:</strong> <span style="font-weight: bold;">${b.returnDate} at ${b.returnTime || "TBD"}</span>
                    ${b.returnFlightNumber ? ` (Flight: ${b.returnFlightNumber})` : ""}
                  </div>
                ` : ""}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #374151;">
                <div>Vehicle: <strong>${b.vehicle}</strong> (${b.journeyType === "return" ? "Return" : "One-Way"})</div>
                <div style="font-size: 18px; font-weight: bold; color: #111;">£${Number(b.price || 0).toFixed(2)}</div>
              </div>
            </div>
          `;
        }).join("");

    const pageHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cardiff Taxis Bookings Dashboard</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 16px; color: #111; }
          .container { max-width: 680px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; margin: 0; }
          .refresh-btn { background: #111; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1 class="title">Cardiff Taxis Bookings</h1>
              <div style="font-size: 12px; color: #6b7280;">Live server store (${bookings.length} recorded)</div>
            </div>
            <a href="/api/bookings" class="refresh-btn">🔄 Refresh</a>
          </div>
          ${cardsHtml}
        </div>
      </body>
      </html>
    `;

    return new Response(pageHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Failed to list bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
