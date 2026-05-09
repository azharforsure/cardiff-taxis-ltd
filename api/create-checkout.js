/**
 * Serverless API function: Create a SumUp checkout.
 * 
 * Deploy this as a Vercel/Netlify serverless function at /api/create-checkout.
 * 
 * ENVIRONMENT VARIABLES REQUIRED ON SERVER:
 *   SUMUP_API_KEY       — Your SumUp secret API key
 *   SUMUP_MERCHANT_CODE — Your SumUp merchant code
 * 
 * These are server-side only and NEVER exposed to the client.
 */

export default async function handler(req, res) {
  // Only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, currency, checkoutReference, description, customerEmail, redirectUrl } = req.body;

  // Validate
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const SUMUP_API_KEY = process.env.SUMUP_API_KEY;
  const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;

  if (!SUMUP_API_KEY || !SUMUP_MERCHANT_CODE) {
    return res.status(500).json({ error: "Payment service not configured on server" });
  }

  try {
    const payload = {
      amount: parseFloat(amount.toFixed(2)),
      currency: currency || "GBP",
      checkout_reference: checkoutReference,
      merchant_code: SUMUP_MERCHANT_CODE,
      description: description || "Cardiff Taxis Booking",
      personal_details: customerEmail ? {
        email: customerEmail
      } : undefined,
      transaction_control: {
        settlement: "AUTO"
      }
    };

    // If a redirect URL is provided, use hosted checkout
    if (redirectUrl) {
      payload.hosted_checkout = {
        enabled: true,
        redirect_url: redirectUrl,
      };
    }

    console.log("Creating SumUp checkout with payload:", JSON.stringify(payload, null, 2));

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
      return res.status(500).json({ error: "External API error", detail: "Non-JSON response" });
    }

    if (!response.ok) {
      console.error("SumUp API error:", data);
      return res.status(response.status).json({
        error: data.message || "Failed to create checkout",
      });
    }

    console.log("SumUp checkout created successfully:", data.id);

    // Return the checkout ID (and hosted URL if applicable)
    return res.status(200).json({
      id: data.id,
      checkout_reference: data.checkout_reference,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      hosted_checkout_url: data.hosted_checkout_url || null,
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
