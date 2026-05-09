import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Car,
  Calendar,
  Clock,
  Route,
  CreditCard,
  Plane,
  CircleDot,
  Navigation,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { Button } from "../ui/Button";
import { calculateFare, calculateReturnFare, formatDuration } from "../../lib/pricing";
import {
  createSumUpCheckout,
  generateBookingReference,
  loadSumUpSDK,
  mountSumUpWidget,
  unmountSumUpWidget,
} from "../../lib/sumup";

interface StepConfirmProps {
  onBack: () => void;
}

type PaymentState = "details" | "processing" | "payment" | "success" | "error";

export const StepConfirm = ({ onBack }: StepConfirmProps) => {
  const booking = useBooking();
  const [paymentState, setPaymentState] = useState<PaymentState>("details");
  const [error, setError] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const price =
    booking.selectedVehicle && booking.distanceMiles > 0
      ? booking.journeyType === "return"
        ? calculateReturnFare(booking.selectedVehicle, booking.distanceMiles)
        : calculateFare(booking.selectedVehicle, booking.distanceMiles)
      : 0;

  // Cleanup SumUp widget on unmount
  useEffect(() => {
    return () => {
      unmountSumUpWidget();
    };
  }, []);

  const handleProceedToPayment = async () => {
    if (!booking.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!booking.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!booking.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setPaymentState("processing");

    const ref = generateBookingReference();
    setBookingRef(ref);

    try {
      // Step 1: Create SumUp checkout via server
      const checkout = await createSumUpCheckout({
        amount: price,
        currency: "GBP",
        checkoutReference: ref,
        description: `Cardiff Taxis - ${booking.selectedVehicle?.name} - ${booking.pickup?.address} to ${booking.dropoff?.address}`,
        customerEmail: booking.email,
      });

      // Step 2: Mount the SumUp payment widget
      setPaymentState("payment");

      // Small delay to ensure the container is rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      await mountSumUpWidget(
        "sumup-card-container",
        checkout.id,
        async (body) => {
          // Unmount first to avoid React "removeChild" crashes
          unmountSumUpWidget();
          
          // Payment succeeded — send booking confirmation email
          setPaymentState("success");
          await sendBookingConfirmation(ref);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        (errorBody) => {
          unmountSumUpWidget();
          setPaymentState("error");
          setError(
            "Payment was not completed. Please try again or call us at 07817 385655."
          );
        }
      );
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentState("error");
      setError(
        err.message?.includes("Failed to fetch") || err.message?.includes("Checkout creation")
          ? "Payment service is currently unavailable. Please call us at 07817 385655 to complete your booking."
          : "Something went wrong. Please try again."
      );
    }
  };

  const sendBookingConfirmation = async (ref: string) => {
    try {
      const formatLuggage = (l: string) => {
        if (l === "none") return "None";
        if (l === "hand_carry") return "Hand Carries";
        return "Suitcases";
      };

      const stopsText = booking.stops
        .filter((s) => s?.address)
        .map((s, i) => `<li><strong>Stop ${i + 1}:</strong> ${s.address}</li>`)
        .join("");

      const customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #111; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Cardiff Taxis LTD</h1>
            <p style="margin: 5px 0 0; color: #ffca28;">Booking Confirmation</p>
          </div>
          <div style="padding: 20px;">
            <p>Hello <strong>${booking.name}</strong>,</p>
            <p>Thank you for booking with Cardiff Taxis LTD. Your booking is confirmed and paid.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Booking Details</h2>
              <p><strong>Reference:</strong> ${ref}</p>
              <p><strong>Status:</strong> <span style="color: green;">✅ PAID via SumUp</span></p>
              <p><strong>Vehicle:</strong> ${booking.selectedVehicle?.name}</p>
              <p><strong>Price:</strong> £${price.toFixed(2)}</p>
              <p><strong>Service:</strong> ${booking.serviceType === "airport" ? "Airport Transfer" : "City Private Hire"}</p>
              <p><strong>Journey:</strong> ${booking.journeyType === "return" ? "Return" : "One Way"}</p>
              <p><strong>Luggage:</strong> ${formatLuggage(booking.luggage)}</p>
            </div>

            <div style="margin: 20px 0;">
              <h2 style="font-size: 18px;">Journey Information</h2>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Pickup:</strong> ${booking.pickup?.address}</p>
              ${stopsText ? `<ul>${stopsText}</ul>` : ""}
              <p><strong>Drop-off:</strong> ${booking.dropoff?.address}</p>
              <p><strong>Distance:</strong> ${booking.distanceMiles} miles</p>
              <p><strong>Duration:</strong> ${formatDuration(booking.durationSeconds)}</p>
              ${booking.flightNumber ? `<p><strong>Flight Number:</strong> ${booking.flightNumber}</p>` : ""}
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>Cardiff Taxis LTD | 24/7 Professional Service</p>
              <p>Phone: 07817 385655 | Email: bookings@cardifftaxisltd.co.uk</p>
            </div>
          </div>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ffca28; border-radius: 10px; overflow: hidden;">
          <div style="background: #111; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 NEW PAID BOOKING</h1>
            <p style="margin: 5px 0 0; color: #ffca28;">Reference: ${ref}</p>
          </div>
          <div style="padding: 20px;">
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px; color: #2e7d32;">Payment Confirmed</h2>
              <p style="margin: 5px 0 0;">The customer has successfully paid <strong>£${price.toFixed(2)}</strong> via SumUp.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Customer:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.phone}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.email}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.serviceType === "airport" ? "Airport Transfer" : "City Private Hire"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Journey:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.journeyType === "return" ? "Return" : "One Way"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Luggage:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formatLuggage(booking.luggage)}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Pickup:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.pickup?.address}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Drop-off:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.dropoff?.address}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Distance/Duration:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.distanceMiles} miles (${formatDuration(booking.durationSeconds)})</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date/Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.date} at ${booking.time}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Vehicle:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.selectedVehicle?.name}</td></tr>
              ${booking.flightNumber ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Flight:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.flightNumber}</td></tr>` : ""}
            </table>
            
            ${stopsText ? `<div style="margin-top: 15px;"><strong>Stops:</strong><ul>${stopsText}</ul></div>` : ""}
          </div>
        </div>
      `;

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: booking.email,
          subject: `Booking Confirmed: ${ref} - Cardiff Taxis LTD`,
          adminSubject: `🚨 NEW PAID BOOKING: ${ref} - ${booking.name} (£${price.toFixed(2)})`,
          html: customerHtml,
          adminHtml: adminHtml,
        }),
      });
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  };

  // ─── SUCCESS STATE ───
  if (paymentState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-brand-graphite mb-3">
            Booking Confirmed & Paid!
          </h2>
          <p className="text-brand-muted font-medium text-[15px] max-w-md mx-auto leading-relaxed">
            Thank you, {booking.name}. Your booking{" "}
            <strong className="text-brand-graphite">{bookingRef}</strong> for{" "}
            <strong className="text-brand-graphite">£{price.toFixed(2)}</strong>{" "}
            has been confirmed. A confirmation will be sent to{" "}
            <strong className="text-brand-graphite">{booking.email}</strong>.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-brand-section rounded-[20px] p-6 w-full max-w-md">
          <div className="flex flex-col gap-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-brand-muted font-medium">Reference</span>
              <span className="text-brand-graphite font-bold font-mono text-[13px]">
                {bookingRef}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted font-medium">Vehicle</span>
              <span className="text-brand-graphite font-bold">
                {booking.selectedVehicle?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted font-medium">Date</span>
              <span className="text-brand-graphite font-bold">
                {booking.date} at {booking.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted font-medium">Distance</span>
              <span className="text-brand-graphite font-bold">
                {booking.distanceMiles} miles
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted font-medium">Type</span>
              <span className="text-brand-graphite font-bold">
                {booking.journeyType === "return" ? "Return" : "One Way"}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-3">
              <span className="text-brand-graphite font-bold text-[16px]">
                Total Paid
              </span>
              <span className="text-green-600 font-bold text-[20px]">
                £{price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-brand-muted font-semibold">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Payment processed securely by SumUp
        </div>

        <button
          onClick={() => booking.resetBooking()}
          className="w-full max-w-md h-[56px] rounded-[20px] bg-brand-accent text-brand-graphite font-bold text-[16px] hover:bg-brand-accent-hover transition-all"
        >
          Make another booking
        </button>
      </div>
    );
  }

  // ─── PAYMENT WIDGET STATE ───
  if (paymentState === "payment") {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in">
        {/* Price header */}
        <div className="bg-brand-section rounded-[16px] md:rounded-[20px] p-5 md:p-6 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-brand-muted font-bold uppercase tracking-wider">
              Amount to pay
            </p>
            <p className="text-[11px] text-brand-muted font-semibold">
              Ref: {bookingRef}
            </p>
          </div>
          <p className="text-[32px] font-bold text-brand-graphite">
            £{price.toFixed(2)}
          </p>
        </div>

        {/* SumUp Card Widget Container */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-brand-muted" />
            <span className="text-[13px] text-brand-muted font-semibold">
              Secure payment powered by SumUp
            </span>
          </div>

          <div
            id="sumup-card-container"
            className="min-h-[200px] flex items-center justify-center"
          >
            {/* SumUp SDK mounts here */}
            <div className="flex flex-col items-center gap-3 text-brand-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[14px] font-semibold">Loading payment form...</span>
            </div>
          </div>

          {/* Accepted cards */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <span className="text-[12px] text-brand-muted font-semibold">Accepted:</span>
            <div className="flex items-center gap-2">
              {/* Visa */}
              <div className="w-10 h-7 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-700">VISA</span>
              </div>
              {/* Mastercard */}
              <div className="w-10 h-7 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[9px] font-bold text-red-600">MC</span>
              </div>
              {/* Apple Pay */}
              <div className="w-10 h-7 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[9px] font-bold text-black"> Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-semibold">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Back */}
        <Button
          variant="glass"
          onClick={() => {
            unmountSumUpWidget();
            setPaymentState("details");
          }}
          className="h-[56px] px-8 text-brand-graphite text-[15px] font-bold rounded-[16px] bg-brand-section hover:bg-black/10 transition-colors border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to details
        </Button>
      </div>
    );
  }

  // ─── PROCESSING STATE ───
  if (paymentState === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-section flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
        <p className="text-[15px] font-semibold text-brand-graphite">
          Setting up secure payment...
        </p>
      </div>
    );
  }

  // ─── DETAILS FORM (default) ───
  return (
    <div className="flex flex-col gap-6">
      {/* Booking Summary */}
      <div className="bg-brand-section rounded-[16px] md:rounded-[20px] p-5 md:p-6 flex flex-col gap-4">
        <h3 className="text-[18px] font-bold text-brand-graphite">
          Booking Summary
        </h3>

        {/* Route */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <CircleDot className="w-4 h-4 text-green-500 shrink-0" strokeWidth={2.5} />
            <span className="text-[14px] text-brand-graphite font-semibold truncate">
              {booking.pickup?.address}
            </span>
          </div>
          {booking.stops
            .filter((s) => s?.address)
            .map((stop, i) => (
              <div key={i} className="flex items-center gap-3 pl-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2} />
                <span className="text-[13px] text-brand-muted font-semibold truncate">
                  {stop.address}
                </span>
              </div>
            ))}
          <div className="flex items-center gap-3">
            <Navigation className="w-4 h-4 text-red-500 shrink-0" strokeWidth={2.5} />
            <span className="text-[14px] text-brand-graphite font-semibold truncate">
              {booking.dropoff?.address}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-brand-border">
          <div>
            <p className="text-[12px] text-brand-muted font-semibold">
              Distance
            </p>
            <p className="text-[15px] text-brand-graphite font-bold">
              {booking.distanceMiles} mi
            </p>
          </div>
          <div>
            <p className="text-[12px] text-brand-muted font-semibold">
              Duration
            </p>
            <p className="text-[15px] text-brand-graphite font-bold">
              {formatDuration(booking.durationSeconds)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-brand-muted font-semibold">Date</p>
            <p className="text-[15px] text-brand-graphite font-bold">
              {booking.date}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-brand-muted font-semibold">
              Vehicle
            </p>
            <p className="text-[15px] text-brand-graphite font-bold">
              {booking.selectedVehicle?.name}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <div>
            <p className="text-[12px] text-brand-muted font-semibold uppercase tracking-wider">
              {booking.journeyType === "return" ? "Return Journey" : "One Way"}{" "}
              Total
            </p>
            {booking.journeyType === "return" && (
              <p className="text-[11px] text-green-600 font-bold">
                5% return discount applied
              </p>
            )}
          </div>
          <p className="text-[28px] md:text-[32px] font-bold text-brand-graphite">
            £{price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[20px] font-bold text-brand-graphite">
          Contact Details
        </h3>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={booking.name}
            onChange={(e) => booking.setName(e.target.value)}
            className="w-full h-[54px] md:h-[64px] rounded-[16px] md:rounded-[20px] bg-brand-section border border-gray-200 px-4 text-brand-graphite text-[15px] font-semibold focus:border-gray-400 outline-none transition-colors"
            placeholder="John Smith"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={booking.phone}
              onChange={(e) => booking.setPhone(e.target.value)}
              className="w-full h-[54px] md:h-[64px] rounded-[16px] md:rounded-[20px] bg-brand-section border border-gray-200 px-4 text-brand-graphite text-[15px] font-semibold focus:border-gray-400 outline-none transition-colors"
              placeholder="07XXX XXXXXX"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={booking.email}
              onChange={(e) => booking.setEmail(e.target.value)}
              className="w-full h-[54px] md:h-[64px] rounded-[16px] md:rounded-[20px] bg-brand-section border border-gray-200 px-4 text-brand-graphite text-[15px] font-semibold focus:border-gray-400 outline-none transition-colors"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Payment Info & Terms */}
      <div className="flex flex-col gap-3">
        <div className="bg-brand-primary rounded-[14px] p-4 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-brand-accent shrink-0" />
          <div>
            <p className="text-[14px] font-bold text-white">
              Secure Online Payment
            </p>
            <p className="text-[12px] text-white/60 font-semibold">
              Pay securely via SumUp — Visa, Mastercard, and Apple Pay accepted.
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 ml-auto" />
        </div>

        {booking.flightNumber && (
          <div className="bg-blue-50 rounded-[14px] p-4 flex items-center gap-3 border border-blue-200">
            <Plane className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-blue-800">
                Flight: {booking.flightNumber}
              </p>
              <p className="text-[12px] text-blue-600 font-semibold">
                We'll track your flight and adjust pickup time for any delays.
              </p>
            </div>
          </div>
        )}

        <p className="text-[13px] text-brand-muted/70 font-semibold">
          By proceeding to payment, you agree to our{" "}
          <Link
            to="/terms"
            className="text-brand-primary font-bold underline"
          >
            Terms & Conditions
          </Link>
          .
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-semibold animate-shake">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <Button
          variant="glass"
          onClick={onBack}
          className="h-[60px] md:h-[64px] px-8 text-brand-graphite text-[16px] font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] bg-brand-section hover:bg-black/10 transition-colors border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          variant="accent"
          onClick={handleProceedToPayment}
          className="flex-1 h-[60px] md:h-[64px] pl-6 pr-6 py-2 text-brand-graphite whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-center gap-3 transition-all"
        >
          Proceed to Payment — £{price.toFixed(2)}
          <Lock className="w-5 h-5 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
};
