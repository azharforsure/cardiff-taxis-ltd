import { NextResponse } from "next/server";
import { getAllBookings } from "../../../src/lib/bookings-store";

export const dynamic = "force-dynamic";

const ADMIN_PASSCODE =
  process.env.ADMIN_PASSCODE || process.env.ADMIN_SECRET_KEY || "cardiff786";

function isAuthorized(req: Request): boolean {
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key") || url.searchParams.get("pin");
  if (keyParam === ADMIN_PASSCODE) return true;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.replace(/^Bearer\s+/i, "") === ADMIN_PASSCODE) {
    return true;
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === ADMIN_PASSCODE) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let pin = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      pin = formData.get("pin")?.toString() || "";
    } else {
      const body = await req.json().catch(() => ({}));
      pin = body.pin || "";
    }

    if (pin === ADMIN_PASSCODE) {
      const response = NextResponse.redirect(new URL("/api/bookings", req.url), 303);
      response.cookies.set("admin_token", ADMIN_PASSCODE, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    return new Response(renderLoginScreen("Incorrect passcode. Please try again."), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const format = url.searchParams.get("format");
    const accept = req.headers.get("accept") || "";
    const isJson =
      format === "json" ||
      (!accept.includes("text/html") && accept.includes("application/json"));

    // Check authorization
    if (!isAuthorized(req)) {
      if (isJson) {
        return NextResponse.json(
          { error: "Unauthorized. Please provide valid admin credentials." },
          { status: 401 }
        );
      }
      return new Response(renderLoginScreen(), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const bookings = getAllBookings();

    // Authorized JSON client
    if (isJson) {
      return NextResponse.json({ success: true, count: bookings.length, bookings });
    }

    // Authorized HTML client
    const cardsHtml =
      bookings.length === 0
        ? `<div style="text-align: center; padding: 40px; color: #888;">No bookings recorded yet.</div>`
        : bookings
            .map((b) => {
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
                ${
                  b.returnDate
                    ? `
                  <div style="margin-top: 4px; color: #1d4ed8;">
                    <strong>🔁 Return:</strong> <span style="font-weight: bold;">${b.returnDate} at ${b.returnTime || "TBD"}</span>
                    ${b.returnFlightNumber ? ` (Flight: ${b.returnFlightNumber})` : ""}
                  </div>
                `
                    : ""
                }
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #374151;">
                <div>Vehicle: <strong>${b.vehicle}</strong> (${b.journeyType === "return" ? "Return" : "One-Way"})</div>
                <div style="font-size: 18px; font-weight: bold; color: #111;">£${Number(b.price || 0).toFixed(2)}</div>
              </div>
            </div>
          `;
            })
            .join("");

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
              <div style="font-size: 12px; color: #6b7280;">Secure portal (${bookings.length} recorded)</div>
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

function renderLoginScreen(errorMsg?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Access | Cardiff Taxis LTD</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
        .box { background: #fff; border-radius: 16px; padding: 32px 24px; width: 100%; max-width: 380px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        h2 { margin: 0 0 8px 0; font-size: 20px; color: #111; }
        p { margin: 0 0 24px 0; font-size: 13px; color: #666; }
        input { width: 100%; box-sizing: border-box; padding: 14px; font-size: 16px; border: 1px solid #ddd; border-radius: 10px; margin-bottom: 16px; text-align: center; font-weight: bold; }
        button { width: 100%; padding: 14px; font-size: 16px; font-weight: bold; background: #ffca28; color: #111; border: none; border-radius: 10px; cursor: pointer; }
        button:hover { background: #f5b700; }
        .error { color: #dc2626; font-size: 13px; margin-bottom: 16px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>🔒 Admin Portal</h2>
        <p>Cardiff Taxis LTD Bookings Access</p>
        ${errorMsg ? `<div class="error">${errorMsg}</div>` : ""}
        <form method="POST" action="/api/bookings">
          <input type="password" name="pin" placeholder="Enter Admin Passcode" autofocus required />
          <button type="submit">Unlock Dashboard</button>
        </form>
      </div>
    </body>
    </html>
  `;
}
