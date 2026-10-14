import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { customerEmail, subject, adminSubject, html, adminHtml } = await req.json();
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bookings@cardifftaxisltd.co.uk";

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // 1. Send to Customer
    const customerPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cardiff Taxis LTD <bookings@cardifftaxisltd.co.uk>",
        to: customerEmail,
        subject: subject,
        html: html,
      }),
    });

    // 2. Send to Admin
    const adminPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cardiff Taxis LTD <bookings@cardifftaxisltd.co.uk>",
        to: ADMIN_EMAIL,
        subject: adminSubject || `🚨 NEW BOOKING: ${subject}`,
        html: adminHtml || html,
      }),
    });

    const [customerRes, adminRes] = await Promise.all([customerPromise, adminPromise]);

    if (customerRes.ok && adminRes.ok) {
      return NextResponse.json({ success: true });
    } else {
      const custErr = !customerRes.ok ? await customerRes.text() : null;
      const adminErr = !adminRes.ok ? await adminRes.text() : null;
      console.error("Resend errors:", { custErr, adminErr });
      return NextResponse.json({ error: "One or more emails failed to send" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
