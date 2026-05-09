import { useState } from "react";
import { ArrowRight, Plus, X, Plane, MapPin, Clock, Calendar, CircleDot, Navigation } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import { Button } from "../ui/Button";

interface StepJourneyProps {
  compact?: boolean; // true = hero widget mode
  onNext: () => void;
}

export const StepJourney = ({ compact = false, onNext }: StepJourneyProps) => {
  const booking = useBooking();
  const [error, setError] = useState("");

  const handleGetQuote = () => {
    if (!booking.pickup) {
      setError("Please enter a pickup location.");
      return;
    }
    if (!booking.dropoff) {
      setError("Please enter a drop-off location.");
      return;
    }
    if (!booking.date && !compact) {
      setError("Please select a date.");
      return;
    }
    if (!booking.time && !compact) {
      setError("Please select a time.");
      return;
    }
    if (booking.locationWarning) {
      setError(booking.locationWarning);
      return;
    }
    setError("");
    onNext();
  };

  // Today's date for min
  const today = new Date().toISOString().split("T")[0];

  if (compact) {
    // ─── HERO COMPACT WIDGET ───
    return (
      <div className="flex flex-col gap-2 lg:gap-3 w-full">
        <div className="flex flex-col xl:flex-row w-full gap-2 lg:gap-3">
          {/* Service Type */}
          <div className="w-full xl:w-[180px] bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 transition-colors">
            <select
              value={booking.serviceType}
              onChange={(e) => booking.setServiceType(e.target.value as "airport" | "city")}
              className="w-full bg-transparent focus:outline-none text-black text-[15px] font-semibold cursor-pointer"
            >
              <option value="airport">Airport Transfer</option>
              <option value="city">City Private Hire</option>
            </select>
          </div>

          {/* Pickup & Dropoff */}
          <div className="grid grid-cols-1 md:grid-cols-2 flex-[1.5] w-full gap-2">
            <PlaceAutocomplete
              value={booking.pickup}
              onChange={booking.setPickup}
              placeholder="Enter pickup location"
              serviceType={booking.serviceType}
              onLocationWarning={booking.setLocationWarning}
              icon={<CircleDot className="w-[16px] h-[16px] text-green-500 shrink-0" strokeWidth={2.5} />}
            />

            <PlaceAutocomplete
              value={booking.dropoff}
              onChange={booking.setDropoff}
              placeholder="Enter drop-off location"
              serviceType={booking.serviceType}
              onLocationWarning={booking.setLocationWarning}
              icon={<Navigation className="w-[16px] h-[16px] text-red-500 shrink-0" strokeWidth={2.5} />}
            />
          </div>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row flex-[1] w-full gap-2">
            <div className="w-full sm:flex-1 bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-2 transition-colors shrink-0">
              <Clock className="w-[16px] h-[16px] text-brand-muted shrink-0" strokeWidth={2} />
              <input
                type="time"
                value={booking.time}
                onChange={(e) => booking.setTime(e.target.value)}
                className="w-full h-full bg-transparent focus:outline-none text-black text-[15px] font-semibold"
                style={{ colorScheme: "light" }}
              />
            </div>

            <div className="w-full sm:flex-1 bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-2 transition-colors shrink-0">
              <Calendar className="w-[16px] h-[16px] text-brand-muted shrink-0" strokeWidth={2} />
              <input
                type="date"
                value={booking.date}
                onChange={(e) => booking.setDate(e.target.value)}
                min={today}
                className="w-full h-full bg-transparent focus:outline-none text-black text-[15px] font-semibold uppercase"
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>

          {/* Get Quote Button */}
          <Button
            variant="accent"
            onClick={handleGetQuote}
            className="w-full xl:w-auto h-[60px] md:h-[64px] px-8 text-brand-graphite whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-center gap-3 shrink-0 mt-1 md:mt-0 transition-all"
          >
            Get instant quote
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-semibold animate-shake slide-in-from-top-2">
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>
    );
  }

  // ─── FULL BOOKING PAGE LAYOUT ───
  return (
    <div className="flex flex-col gap-6">
      {/* Service Type */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Service Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => booking.setServiceType("airport")}
            className={`h-[60px] md:h-[68px] rounded-[16px] md:rounded-[20px] border-2 font-bold text-[14px] md:text-[15px] transition-all flex items-center justify-center gap-2 ${
              booking.serviceType === "airport"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-brand-section text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            <Plane className="w-[18px] h-[18px]" strokeWidth={2} />
            Airport Transfer
          </button>
          <button
            type="button"
            onClick={() => booking.setServiceType("city")}
            className={`h-[60px] md:h-[68px] rounded-[16px] md:rounded-[20px] border-2 font-bold text-[14px] md:text-[15px] transition-all flex items-center justify-center gap-2 ${
              booking.serviceType === "city"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-brand-section text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            <MapPin className="w-[18px] h-[18px]" strokeWidth={2} />
            City Private Hire
          </button>
        </div>
        <p className="text-[12px] text-brand-muted font-semibold mt-1">
          {booking.serviceType === "airport"
            ? "Cardiff, Bristol & London airports"
            : "Cardiff city area only"}
        </p>
      </div>

      {/* Pickup */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Pickup Location *
        </label>
        <PlaceAutocomplete
          value={booking.pickup}
          onChange={booking.setPickup}
          placeholder={
            booking.serviceType === "airport"
              ? "Airport, address, or postcode"
              : "Cardiff address or postcode"
          }
          serviceType={booking.serviceType}
          onLocationWarning={booking.setLocationWarning}
          icon={<CircleDot className="w-[16px] h-[16px] text-green-500 shrink-0" strokeWidth={2.5} />}
        />
      </div>

      {/* Stops */}
      {booking.stops.map((stop, index) => (
        <div key={index} className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
              Stop {index + 1}
            </label>
            <button
              type="button"
              onClick={() => booking.removeStop(index)}
              className="text-[12px] text-red-500 font-bold flex items-center gap-1 hover:text-red-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          <PlaceAutocomplete
            value={stop}
            onChange={(place) => booking.updateStop(index, place)}
            placeholder="Enter stop location"
            serviceType={booking.serviceType}
            onLocationWarning={booking.setLocationWarning}
            icon={<MapPin className="w-[16px] h-[16px] text-amber-500 shrink-0" strokeWidth={2.5} />}
          />
        </div>
      ))}

      {booking.stops.length < 3 && (
        <button
          type="button"
          onClick={booking.addStop}
          className="flex items-center justify-center gap-2 h-[48px] rounded-[14px] border-2 border-dashed border-gray-300 text-brand-muted hover:border-brand-graphite hover:text-brand-graphite font-bold text-[13px] transition-all hover:bg-brand-section"
        >
          <Plus className="w-4 h-4" />
          Add a stop
        </button>
      )}

      {/* Drop-off */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Drop-off Location *
        </label>
        <PlaceAutocomplete
          value={booking.dropoff}
          onChange={booking.setDropoff}
          placeholder={
            booking.serviceType === "airport"
              ? "Airport, address, or postcode"
              : "Cardiff address or postcode"
          }
          serviceType={booking.serviceType}
          onLocationWarning={booking.setLocationWarning}
          icon={<Navigation className="w-[16px] h-[16px] text-red-500 shrink-0" strokeWidth={2.5} />}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
            Date *
          </label>
          <div className="w-full bg-brand-section border border-gray-200 rounded-[16px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-2">
            <Calendar className="w-[16px] h-[16px] text-brand-muted shrink-0" strokeWidth={2} />
            <input
              type="date"
              value={booking.date}
              onChange={(e) => booking.setDate(e.target.value)}
              min={today}
              className="w-full bg-transparent focus:outline-none text-brand-graphite text-[15px] font-semibold"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
            Time *
          </label>
          <div className="w-full bg-brand-section border border-gray-200 rounded-[16px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-2">
            <Clock className="w-[16px] h-[16px] text-brand-muted shrink-0" strokeWidth={2} />
            <input
              type="time"
              value={booking.time}
              onChange={(e) => booking.setTime(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-brand-graphite text-[15px] font-semibold"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>
      </div>

      {/* Flight Number (Airport only) */}
      {booking.serviceType === "airport" && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
            Flight Number (Optional)
          </label>
          <div className="w-full bg-brand-section border border-gray-200 rounded-[16px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-2">
            <Plane className="w-[16px] h-[16px] text-brand-muted shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={booking.flightNumber}
              onChange={(e) => booking.setFlightNumber(e.target.value)}
              placeholder="e.g. BA1234"
              className="w-full bg-transparent focus:outline-none text-brand-graphite text-[15px] font-semibold"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-semibold animate-shake slide-in-from-top-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="accent"
        onClick={handleGetQuote}
        className="w-full h-[60px] md:h-[64px] px-8 text-brand-graphite whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-center gap-3 mt-2 transition-all"
      >
        Get instant quote
        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
      </Button>
    </div>
  );
};
