import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Route,
  Loader2,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "../../context/BookingContext";
import { JourneyMap } from "./JourneyMap";
import { VehicleCard } from "./VehicleCard";
import { Button } from "../ui/Button";
import {
  getAllQuotes,
  metersToMiles,
  formatDuration,
  VEHICLES,
} from "../../lib/pricing";
import { calculateRoute } from "../../lib/google-maps";

interface StepQuoteProps {
  onNext: () => void;
  onBack: () => void;
}

const miniReviews = [
  {
    name: "Sian R.",
    text: "Driver arrived early, the journey was smooth. Very reassuring after a long flight.",
    rating: 5,
  },
  {
    name: "Gareth D.",
    text: "Booking is easy, and I can rely on them for all my Bristol and London trips.",
    rating: 5,
  },
  {
    name: "Elin T.",
    text: "Consistently punctual with very clear prices, no hidden shocks.",
    rating: 5,
  },
];

export const StepQuote = ({ onNext, onBack }: StepQuoteProps) => {
  const booking = useBooking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);

  // Calculate route on mount
  useEffect(() => {
    const compute = async () => {
      if (!booking.pickup || !booking.dropoff) {
        setError("Missing pickup or drop-off location.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const validStops = booking.stops.filter(
          (s) => s && s.placeId
        );

        const result = await calculateRoute(
          booking.pickup,
          booking.dropoff,
          validStops
        );

        if (result) {
          const miles = metersToMiles(result.distanceMeters);
          booking.setRouteInfo(
            miles,
            result.durationSeconds,
            result.route
          );

          // Auto-select cheapest vehicle
          if (!booking.selectedVehicle) {
            booking.setSelectedVehicle(VEHICLES[0]);
          }
        } else {
          setError("Could not calculate route. Please check your locations.");
        }
      } catch (err) {
        setError("Failed to calculate route. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    compute();
  }, []); // Only on mount

  // Cycle reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((i) => (i + 1) % miniReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (!booking.selectedVehicle) {
      setError("Please select a vehicle.");
      return;
    }
    setError("");
    onNext();
  };

  const quotes = booking.distanceMiles > 0
    ? getAllQuotes(booking.distanceMiles, booking.journeyType === "return", booking.serviceType)
    : [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-brand-section rounded-[16px] md:rounded-[20px] p-4 md:p-5 h-[80px] animate-pulse"></div>
        <div className="h-[250px] md:h-[300px] w-full bg-brand-section rounded-[16px] md:rounded-[20px] animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-muted animate-spin" />
            <p className="text-[14px] text-brand-muted font-semibold">Calculating route...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[56px] rounded-[14px] bg-brand-section animate-pulse"></div>
          <div className="h-[56px] rounded-[14px] bg-brand-section animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Journey Summary Bar */}
      <div className="bg-brand-section rounded-[16px] md:rounded-[20px] p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Route className="w-5 h-5 text-brand-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] text-brand-muted font-semibold truncate">
              {booking.pickup?.address}
            </p>
            {booking.stops.filter((s) => s?.address).length > 0 && (
              <p className="text-[11px] text-amber-600 font-semibold">
                + {booking.stops.filter((s) => s?.address).length} stop(s)
              </p>
            )}
            <p className="text-[13px] text-brand-graphite font-bold truncate">
              {booking.dropoff?.address}
            </p>
          </div>
        </div>

        <div className="flex gap-6 shrink-0">
          <div className="text-center">
            <p className="text-[22px] md:text-[26px] font-bold text-brand-graphite">
              {booking.distanceMiles}
            </p>
            <p className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider">
              Miles
            </p>
          </div>
          <div className="w-px bg-brand-border" />
          <div className="text-center">
            <p className="text-[22px] md:text-[26px] font-bold text-brand-graphite">
              {formatDuration(booking.durationSeconds)}
            </p>
            <p className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider">
              Duration
            </p>
          </div>
        </div>
      </div>

      {/* Journey Map */}
      {booking.routeResult && (
        <JourneyMap
          route={booking.routeResult}
          className="h-[250px] md:h-[300px]"
        />
      )}

      {/* Journey Type Toggle */}
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Journey Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => booking.setJourneyType("one_way")}
            className={`h-[56px] rounded-[14px] border-2 font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
              booking.journeyType === "one_way"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => booking.setJourneyType("return")}
            className={`h-[56px] rounded-[14px] border-2 font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
              booking.journeyType === "return"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            Return
            <span className="text-[10px] bg-green-500 text-white rounded-full px-2 py-0.5 font-bold">
              5% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Luggage */}
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Luggage
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => booking.setLuggage("none")}
            className={`h-[56px] rounded-[14px] border-2 font-bold text-[13px] transition-all flex flex-col items-center justify-center gap-1 ${
              booking.luggage === "none"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => booking.setLuggage("hand_carry")}
            className={`h-[56px] rounded-[14px] border-2 font-bold text-[13px] transition-all flex flex-col items-center justify-center gap-1 ${
              booking.luggage === "hand_carry"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            Hand Carries
          </button>
          <button
            type="button"
            onClick={() => booking.setLuggage("suitcase")}
            className={`h-[56px] rounded-[14px] border-2 font-bold text-[13px] transition-all flex flex-col items-center justify-center gap-1 ${
              booking.luggage === "suitcase"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-brand-graphite border-gray-200 hover:border-brand-graphite"
            }`}
          >
            Suitcases
          </button>
        </div>
      </div>

      {/* Available Vehicles */}
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-bold text-brand-graphite uppercase tracking-wider">
          Select Vehicle *
        </label>
        <div className="flex flex-col gap-3">
          {quotes.map(({ vehicle, price, pricePerWay }) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              price={price}
              pricePerWay={pricePerWay}
              isReturn={booking.journeyType === "return"}
              isSelected={booking.selectedVehicle?.id === vehicle.id}
              onSelect={() => booking.setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      </div>

      {/* Mini Reviews */}
      <div className="bg-brand-graphite rounded-[16px] md:rounded-[20px] p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-brand-accent fill-brand-accent"
              />
            ))}
          </div>
          <span className="text-white/60 text-[12px] font-bold uppercase tracking-wider">
            Google Reviews
          </span>
        </div>
        <div className="min-h-[60px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={reviewIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <p className="text-white/90 text-[14px] font-medium leading-relaxed mb-2">
                "{miniReviews[reviewIndex].text}"
              </p>
              <p className="text-white/50 text-[13px] font-semibold">
                — {miniReviews[reviewIndex].name}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
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
          onClick={handleContinue}
          className="flex-1 h-[60px] md:h-[64px] pl-6 pr-6 py-2 text-brand-graphite whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-center gap-3 transition-all"
        >
          Book Now
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
};
