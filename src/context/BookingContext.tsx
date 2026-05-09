import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PlaceResult } from "../lib/google-maps";
import type { VehicleType } from "../lib/pricing";

export type ServiceType = "airport" | "city";
export type LuggageType = "none" | "hand_carry" | "suitcase";
export type JourneyType = "one_way" | "return";

export interface BookingState {
  // Step tracking
  currentStep: number;

  // Step 1: Journey
  serviceType: ServiceType;
  pickup: PlaceResult | null;
  dropoff: PlaceResult | null;
  stops: PlaceResult[];
  date: string;
  time: string;
  flightNumber: string;

  // Step 2: Quote
  journeyType: JourneyType;
  luggage: LuggageType;
  selectedVehicle: VehicleType | null;
  distanceMiles: number;
  durationSeconds: number;
  routeResult: google.maps.DirectionsResult | null;

  // Step 3: Confirm
  name: string;
  phone: string;
  email: string;

  // Alerts
  locationWarning: string;
}

interface BookingContextType extends BookingState {
  setStep: (step: number) => void;
  setServiceType: (type: ServiceType) => void;
  setPickup: (place: PlaceResult | null) => void;
  setDropoff: (place: PlaceResult | null) => void;
  addStop: () => void;
  removeStop: (index: number) => void;
  updateStop: (index: number, place: PlaceResult | null) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setFlightNumber: (fn: string) => void;
  setJourneyType: (type: JourneyType) => void;
  setLuggage: (type: LuggageType) => void;
  setSelectedVehicle: (vehicle: VehicleType | null) => void;
  setRouteInfo: (distanceMiles: number, durationSeconds: number, route: google.maps.DirectionsResult | null) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setLocationWarning: (warning: string) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  currentStep: 1,
  serviceType: "airport",
  pickup: null,
  dropoff: null,
  stops: [],
  date: "",
  time: "",
  flightNumber: "",
  journeyType: "one_way",
  luggage: "none",
  selectedVehicle: null,
  distanceMiles: 0,
  durationSeconds: 0,
  routeResult: null,
  name: "",
  phone: "",
  email: "",
  locationWarning: "",
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const setStep = useCallback((step: number) => {
    setState((s) => ({ ...s, currentStep: step }));
  }, []);

  const setServiceType = useCallback((type: ServiceType) => {
    setState((s) => ({ ...s, serviceType: type, locationWarning: "" }));
  }, []);

  const setPickup = useCallback((place: PlaceResult | null) => {
    setState((s) => ({ ...s, pickup: place }));
  }, []);

  const setDropoff = useCallback((place: PlaceResult | null) => {
    setState((s) => ({ ...s, dropoff: place }));
  }, []);

  const addStop = useCallback(() => {
    setState((s) => {
      if (s.stops.length >= 3) return s;
      return { ...s, stops: [...s.stops, null as unknown as PlaceResult] };
    });
  }, []);

  const removeStop = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      stops: s.stops.filter((_, i) => i !== index),
    }));
  }, []);

  const updateStop = useCallback((index: number, place: PlaceResult | null) => {
    setState((s) => {
      const newStops = [...s.stops];
      if (place) {
        newStops[index] = place;
      }
      return { ...s, stops: newStops };
    });
  }, []);

  const setDate = useCallback((date: string) => {
    setState((s) => ({ ...s, date }));
  }, []);

  const setTime = useCallback((time: string) => {
    setState((s) => ({ ...s, time }));
  }, []);

  const setFlightNumber = useCallback((flightNumber: string) => {
    setState((s) => ({ ...s, flightNumber }));
  }, []);

  const setJourneyType = useCallback((journeyType: JourneyType) => {
    setState((s) => ({ ...s, journeyType }));
  }, []);

  const setLuggage = useCallback((luggage: LuggageType) => {
    setState((s) => ({ ...s, luggage }));
  }, []);

  const setSelectedVehicle = useCallback((selectedVehicle: VehicleType | null) => {
    setState((s) => ({ ...s, selectedVehicle }));
  }, []);

  const setRouteInfo = useCallback(
    (distanceMiles: number, durationSeconds: number, route: google.maps.DirectionsResult | null) => {
      setState((s) => ({ ...s, distanceMiles, durationSeconds, routeResult: route }));
    },
    []
  );

  const setName = useCallback((name: string) => {
    setState((s) => ({ ...s, name }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    setState((s) => ({ ...s, phone }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setState((s) => ({ ...s, email }));
  }, []);

  const setLocationWarning = useCallback((locationWarning: string) => {
    setState((s) => ({ ...s, locationWarning }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setStep,
        setServiceType,
        setPickup,
        setDropoff,
        addStop,
        removeStop,
        updateStop,
        setDate,
        setTime,
        setFlightNumber,
        setJourneyType,
        setLuggage,
        setSelectedVehicle,
        setRouteInfo,
        setName,
        setPhone,
        setEmail,
        setLocationWarning,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
