/**
 * SumUp Checkout API integration.
 * 
 * Flow:
 * 1. Client calls createCheckout() with booking details
 * 2. Server creates a checkout via SumUp API
 * 3. Client mounts the SumUp card widget OR redirects to hosted checkout
 * 4. On success, booking confirmation email is sent
 * 
 * REQUIRED ENV VARS (set in .env):
 *   VITE_SUMUP_MERCHANT_CODE  — Your SumUp merchant code
 * 
 * SERVER-SIDE ENV VARS (set on your API server):
 *   SUMUP_API_KEY — Secret API key from SumUp dashboard
 */

const SUMUP_CHECKOUT_API = "https://api.sumup.com/v0.1/checkouts";

export interface SumUpCheckoutRequest {
  amount: number;
  currency: string;
  checkoutReference: string;
  description: string;
  customerEmail?: string;
  redirectUrl?: string;
}

export interface SumUpCheckoutResponse {
  id: string;
  checkout_reference: string;
  amount: number;
  currency: string;
  status: string;
  hosted_checkout_url?: string;
}

/**
 * Create a SumUp checkout via your backend API proxy.
 * 
 * In production, this calls YOUR server (e.g. /api/create-checkout),
 * which in turn calls SumUp's API with the secret key.
 * 
 * For now, this is configured to use a Vercel/Netlify serverless function.
 */
export async function createSumUpCheckout(
  request: SumUpCheckoutRequest
): Promise<SumUpCheckoutResponse> {
  // Use relative path for production (same-origin)
  const response = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Checkout creation failed: ${error}`);
  }

  return response.json();
}

/**
 * Generate a unique booking reference.
 * Format: CTL-YYYYMMDD-RANDOM
 */
export function generateBookingReference(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CTL-${dateStr}-${random}`;
}

/**
 * Load the SumUp Card SDK script.
 */
let sdkLoaded = false;
export async function loadSumUpSDK(): Promise<void> {
  if (sdkLoaded || (window as any).SumUpCard) {
    sdkLoaded = true;
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js";
    script.async = true;
    script.onload = () => {
      sdkLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load SumUp SDK"));
    document.head.appendChild(script);
  });
}

/**
 * Mount the SumUp payment card widget in a container element.
 */
export async function mountSumUpWidget(
  containerId: string,
  checkoutId: string,
  onSuccess: (body: any) => void,
  onError: (error: any) => void
): Promise<void> {
  await loadSumUpSDK();

  const SumUpCard = (window as any).SumUpCard;
  if (!SumUpCard) {
    throw new Error("SumUp SDK not available");
  }

  // Clear any loading indicators before mounting
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
  }

  SumUpCard.mount({
    id: containerId,
    checkoutId,
    onResponse: (type: string, body: any) => {
      if (type === "success") {
        onSuccess(body);
      } else if (type === "error") {
        onError(body);
      }
    },
  });
}

/**
 * Unmount/destroy the SumUp widget.
 */
export function unmountSumUpWidget(): void {
  const SumUpCard = (window as any).SumUpCard;
  if (SumUpCard?.unmount) {
    SumUpCard.unmount();
  }
}
