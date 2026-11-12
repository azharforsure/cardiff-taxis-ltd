import { NextResponse } from "next/server";
import { saveBooking } from "../../../src/lib/bookings-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, checkoutReference, description, customerEmail, redirectUrl, bookingData } = body;

    // Validate
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Persist full booking details immediately on server
    if (bookingData && checkoutReference) {
      try {
        saveBooking({
          ...bookingData,
          ref: checkoutReference,
          price: parseFloat(amount.toFixed(2)),
          status: "PENDING_PAYMENT",
          createdAt: new Date().toISOString(),
        });
      } catch (saveErr) {
        console.error("Failed to persist booking on server:", saveErr);
      }
    }

    const SUMUP_API_KEY = process.env.SUMUP_API_KEY;
    const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;

    if (!SUMUP_API_KEY || !SUMUP_MERCHANT_CODE) {
      return NextResponse.json({ error: "Payment service not configured on server" }, { status: 500 });
    }

    // Format rich description so owner sees Date, Time, Phone, and Addresses directly in SumUp
    let finalDescription = description || "Cardiff Taxis Booking";
    if (bookingData) {
      const returnPart = bookingData.returnDate ? ` | Ret: ${bookingData.returnDate} ${bookingData.returnTime || ""}` : "";
      finalDescription = `${bookingData.vehicle || "Taxi"} | ${bookingData.date || ""} ${bookingData.time || ""}${returnPart} | Tel: ${bookingData.phone || ""} | ${bookingData.name || ""} | ${bookingData.pickup || ""} to ${bookingData.dropoff || ""}`.slice(0, 250);
    }

    const payload: any = {
      amount: parseFloat(amount.toFixed(2)),
      currency: currency || "GBP",
      checkout_reference: checkoutReference,
      merchant_code: SUMUP_MERCHANT_CODE,
      description: finalDescription,
      personal_details: customerEmail
        ? {
            email: customerEmail,
          }
        : undefined,
      transaction_control: {
        settlement: "AUTO",
      },
    };

    // If a redirect URL is provided, use hosted checkout
    if (redirectUrl) {
      payload.hosted_checkout = {
        enabled: true,
        redirect_url: redirectUrl,
      };
    }

    const response = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUMUP_API_KEY.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response from SumUp:", text);
      return NextResponse.json({ error: "External API error", detail: "Non-JSON response" }, { status: 500 });
    }

    if (!response.ok) {
      console.error("SumUp API error:", data);
      return NextResponse.json(
        {
          error: data.message || "Failed to create checkout",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      id: data.id,
      checkout_reference: data.checkout_reference,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      hosted_checkout_url: data.hosted_checkout_url || null,
    });
  } catch (error: any) {
    console.error("Create checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
