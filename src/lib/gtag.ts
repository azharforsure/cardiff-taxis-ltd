export const GA_TRACKING_ID = "G-C9XM2J6VFB";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Log page view
 */
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Log generic custom event
 */
export const event = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

/**
 * 1. E-commerce Purchase conversion (Paid booking via SumUp)
 */
export const trackPurchase = ({
  transactionId,
  value,
  currency = "GBP",
  vehicle,
  journeyType,
  pickup,
  dropoff,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  vehicle?: string;
  journeyType?: string;
  pickup?: string;
  dropoff?: string;
}) => {
  event("purchase", {
    transaction_id: transactionId,
    value: Number(value.toFixed(2)),
    currency,
    items: [
      {
        item_id: vehicle || "taxi",
        item_name: `${vehicle || "Taxi"} - ${journeyType === "return" ? "Return" : "One-Way"}`,
        price: Number(value.toFixed(2)),
        quantity: 1,
      },
    ],
    journey_type: journeyType,
    pickup_location: pickup,
    dropoff_location: dropoff,
  });
};

/**
 * 2. Begin Checkout conversion (User proceeds from Quote to Payment step)
 */
export const trackBeginCheckout = ({
  value,
  currency = "GBP",
  vehicle,
  journeyType,
}: {
  value: number;
  currency?: string;
  vehicle?: string;
  journeyType?: string;
}) => {
  event("begin_checkout", {
    value: Number(value.toFixed(2)),
    currency,
    items: [
      {
        item_id: vehicle || "taxi",
        item_name: vehicle || "Taxi",
        price: Number(value.toFixed(2)),
        quantity: 1,
      },
    ],
    journey_type: journeyType,
  });
};

/**
 * 3. Quote Calculated / Search conversion (User inputs locations and fetches quote)
 */
export const trackCalculateQuote = ({
  pickup,
  dropoff,
  serviceType,
}: {
  pickup?: string;
  dropoff?: string;
  serviceType?: string;
}) => {
  event("generate_lead", {
    lead_type: "quote_calculated",
    pickup_location: pickup,
    dropoff_location: dropoff,
    service_type: serviceType,
  });
  event("calculate_quote", {
    pickup_location: pickup,
    dropoff_location: dropoff,
    service_type: serviceType,
  });
};

/**
 * 4. Phone Call Click conversion
 */
export const trackPhoneCall = (phoneNumber: string, location: string) => {
  event("contact", {
    method: "phone",
    phone_number: phoneNumber,
    source_location: location,
  });
  event("click_to_call", {
    phone_number: phoneNumber,
    source_location: location,
  });
};

/**
 * 5. WhatsApp Click conversion
 */
export const trackWhatsAppClick = (location: string) => {
  event("contact", {
    method: "whatsapp",
    source_location: location,
  });
  event("click_to_whatsapp", {
    source_location: location,
  });
};

/**
 * 6. Contact Form Submission conversion
 */
export const trackContactFormSubmit = (name: string) => {
  event("generate_lead", {
    method: "contact_form",
    lead_name: name,
  });
  event("contact_form_submitted", {
    lead_name: name,
  });
};
