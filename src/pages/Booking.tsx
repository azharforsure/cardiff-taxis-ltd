import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookingWidget } from "../components/booking/BookingWidget";
import { BookingProvider, useBooking } from "../context/BookingContext";
import type { ServiceType } from "../context/BookingContext";

/**
 * Step Indicator rendered inside the page header.
 */
const StepIndicator = () => {
  const booking = useBooking();

  const steps = [
    { num: 1, label: "Journey" },
    { num: 2, label: "Quote" },
    { num: 3, label: "Payment" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 w-full max-w-[520px] mx-auto mt-8 md:mt-10">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center gap-3 md:gap-4">
          <div
            className={`flex items-center gap-2.5 rounded-full px-4 md:px-5 py-2.5 md:py-3 transition-all duration-300 ${
              booking.currentStep === step.num
                ? "bg-brand-accent shadow-lg shadow-brand-accent/20"
                : booking.currentStep > step.num
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-white/10 backdrop-blur-sm"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all ${
                booking.currentStep === step.num
                  ? "bg-brand-graphite text-white"
                  : booking.currentStep > step.num
                  ? "bg-white text-brand-graphite"
                  : "bg-white/20 text-white/60"
              }`}
            >
              {booking.currentStep > step.num ? "✓" : step.num}
            </div>
            <span
              className={`text-[13px] md:text-[14px] font-bold whitespace-nowrap transition-colors ${
                booking.currentStep === step.num
                  ? "text-brand-graphite"
                  : booking.currentStep > step.num
                  ? "text-white"
                  : "text-white/50"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < 2 && (
            <div
              className={`w-6 md:w-8 h-[2px] rounded-full shrink-0 transition-colors ${
                booking.currentStep > step.num
                  ? "bg-brand-accent/60"
                  : "bg-white/15"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Inner component that pre-fills booking context from URL params.
 */
const BookingPageInner = () => {
  const [searchParams] = useSearchParams();
  const booking = useBooking();

  useEffect(() => {
    // Pre-fill from URL params (passed from Hero widget)
    const pickupParam = searchParams.get("pickup");
    const dropoffParam = searchParams.get("dropoff");
    const serviceParam = searchParams.get("service");
    const dateParam = searchParams.get("date");
    const timeParam = searchParams.get("time");

    if (pickupParam) {
      try {
        booking.setPickup(JSON.parse(pickupParam));
      } catch {}
    }
    if (dropoffParam) {
      try {
        booking.setDropoff(JSON.parse(dropoffParam));
      } catch {}
    }
    if (serviceParam === "airport" || serviceParam === "city") {
      booking.setServiceType(serviceParam as ServiceType);
    }
    if (dateParam) booking.setDate(dateParam);
    if (timeParam) booking.setTime(timeParam);

    // If we have both pickup and dropoff from params, auto-advance to step 2
    if (pickupParam && dropoffParam) {
      booking.setStep(2);
    }
  }, []); // Only on mount

  return <BookingWidget mode="full" />;
};

/**
 * Layout controller — decides grid vs full-width based on step.
 */
const BookingLayout = () => {
  const booking = useBooking();
  const showSidebar = booking.currentStep === 1;

  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-[80px] w-full max-w-[1400px] mx-auto -mt-12 md:-mt-16 relative z-20">
      <div
        className={`grid gap-6 lg:gap-8 transition-all duration-500 ${
          showSidebar
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {/* Main Booking Widget */}
        <div
          className={`bg-white rounded-[20px] md:rounded-[28px] shadow-xl ring-1 ring-black/5 p-5 md:p-8 lg:p-10 transition-all duration-500 ${
            showSidebar ? "lg:col-span-2" : ""
          }`}
        >
          <BookingPageInner />
        </div>

        {/* Sidebar — only visible on Step 1 */}
        {showSidebar && (
          <div className="lg:col-span-1 flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Why Choose Us */}
            <div className="bg-white rounded-[20px] md:rounded-[28px] shadow-xl ring-1 ring-black/5 p-6 md:p-8 border-t-4 border-brand-accent">
              <h3 className="text-lg font-bold text-brand-graphite mb-5">Why Choose Our Service</h3>
              <ul className="flex flex-col gap-5">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-section flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-brand-graphite" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-graphite text-[15px] mb-0.5">Fixed Fares</h4>
                    <p className="text-[13px] text-brand-muted leading-snug font-semibold">No hidden fees or surge charges.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-section flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-brand-graphite" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-graphite text-[15px] mb-0.5">Flight Tracking</h4>
                    <p className="text-[13px] text-brand-muted leading-snug font-semibold">Adjusted pickup for delayed flights.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-section flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-brand-graphite" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-graphite text-[15px] mb-0.5">Secure Payment</h4>
                    <p className="text-[13px] text-brand-muted leading-snug font-semibold">Visa, Mastercard, Apple Pay via SumUp.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-section flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-brand-graphite" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-graphite text-[15px] mb-0.5">5% Return Discount</h4>
                    <p className="text-[13px] text-brand-muted leading-snug font-semibold">Save on return journeys automatically.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Call Card */}
            <div className="bg-brand-primary rounded-[20px] md:rounded-[28px] shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
               <div className="absolute -right-8 -bottom-8 opacity-10">
                 <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
               </div>
               <h3 className="text-lg font-bold mb-2 relative z-10">Need an immediate pick up?</h3>
               <p className="text-white/70 text-[13px] mb-5 relative z-10 leading-relaxed font-semibold">Vehicle needed within 2 hours? Call our dispatch team directly.</p>
               <a href="tel:07817385655" className="inline-flex items-center justify-center w-full h-[52px] rounded-full hover:rounded-2xl bg-white text-brand-graphite font-bold text-[15px] relative z-10 hover:bg-gray-100 transition-all">
                  07817 385655
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Booking = () => {
  return (
    <BookingProvider>
      <div className="flex flex-col pb-24 min-h-[70vh]">
        <Helmet>
          <title>Book a Taxi Cardiff | Instant Quote & Online Booking | Cardiff Taxis Ltd</title>
          <meta name="description" content="Book your Cardiff taxi or airport transfer online. Get an instant quote with route map, choose your vehicle, and confirm — all in minutes. Fixed prices, secure online payment." />
        </Helmet>

        {/* Hero Banner with Step Indicator */}
        <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
          <div className="relative pt-[150px] pb-[80px] md:pt-[200px] md:pb-[100px] bg-brand-primary overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
               <img 
                  src="/images/service_detail_header_1776973788710.png" 
                  alt="Secure Booking" 
                  className="w-full h-full object-cover"
               />
            </div>
            <div className="absolute inset-0 z-10 bg-brand-primary/60 backdrop-blur-[2px] mix-blend-multiply"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent"></div>
            <div className="w-full max-w-[1400px] mx-auto px-6 relative z-20">
              <div className="text-center">
                <span className="text-white/60 text-[13px] md:text-[15px] font-semibold tracking-[0.2em] uppercase mb-3 block">
                  BOOK YOUR TRANSFER
                </span>
                <h1 className="text-[26px] sm:text-[30px] md:text-[36px] lg:text-[42px] font-bold text-white mb-4 leading-[1.1] tracking-tight">Book a Transfer Today</h1>
                <p className="text-[14px] md:text-[15px] text-white/80 max-w-xl mx-auto font-semibold leading-relaxed">
                  Get an instant quote, choose your vehicle, and pay securely online.
                </p>
              </div>

              {/* Step Indicator in Header */}
              <StepIndicator />
            </div>
          </div>
        </div>

        {/* Booking Content — layout adapts to current step */}
        <BookingLayout />
      </div>
    </BookingProvider>
  );
};
