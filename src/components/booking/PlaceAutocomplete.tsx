import { useEffect, useRef, useState, useCallback } from "react";
import { loadGoogleMaps, isInCardiff } from "../../lib/google-maps";
import type { PlaceResult } from "../../lib/google-maps";
import { MapPin, X, AlertTriangle, Loader2 } from "lucide-react";

/**
 * Build a full address from Google Place result.
 * Google's `formatted_address` often strips street-level detail for well-known places.
 * This reconstructs a complete address from address_components.
 */
function buildFullAddress(place: google.maps.places.PlaceResult): string {
  const components = place.address_components;
  if (!components || components.length === 0) {
    return place.formatted_address || place.name || "";
  }

  const getComponent = (type: string): string => {
    const comp = components.find((c) => c.types.includes(type));
    return comp?.long_name || "";
  };

  const name = place.name || "";
  const streetNumber = getComponent("street_number");
  const route = getComponent("route");
  const locality = getComponent("postal_town") || getComponent("locality");
  const postalCode = getComponent("postal_code");

  // Build street part
  const street = streetNumber && route
    ? `${streetNumber} ${route}`
    : route || "";

  // Assemble parts, avoiding duplicates with the place name
  const parts: string[] = [];

  if (name) parts.push(name);

  // Only add street if it's not already part of the name
  if (street && !name.toLowerCase().includes(street.toLowerCase())) {
    parts.push(street);
  }

  // Only add locality if it's not already part of the name
  if (locality && !name.toLowerCase().includes(locality.toLowerCase())) {
    parts.push(locality);
  }

  if (postalCode) parts.push(postalCode);

  // Fallback if we couldn't build anything useful
  if (parts.length <= 1) {
    return place.formatted_address || name;
  }

  return parts.join(", ");
}

interface PlaceAutocompleteProps {
  value: PlaceResult | null;
  onChange: (place: PlaceResult | null) => void;
  placeholder: string;
  serviceType: "airport" | "city";
  onLocationWarning?: (warning: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export const PlaceAutocomplete = ({
  value,
  onChange,
  placeholder,
  serviceType,
  onLocationWarning,
  className = "",
  icon,
}: PlaceAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value?.address || "");
  const [warning, setWarning] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  // Track whether user picked from the dropdown (place_changed fired)
  const pickedFromDropdown = useRef(false);

  /**
   * Process a resolved place — validate Cardiff bounds and call onChange.
   */
  const processPlace = useCallback(
    (result: PlaceResult) => {
      if (serviceType === "city" && !isInCardiff(result.lat, result.lng, result.address)) {
        const msg =
          "City Private Hire is only available within Cardiff. Please select a location in Cardiff or switch to Airport Transfer.";
        setWarning(msg);
        onLocationWarning?.(msg);
      } else {
        setWarning("");
        onLocationWarning?.("");
      }

      setInputValue(result.address);
      onChange(result);
    },
    [serviceType, onChange, onLocationWarning]
  );

  /**
   * Geocode raw text into a PlaceResult using Google Geocoder.
   * Called when user types/pastes a full address without selecting from dropdown.
   */
  const geocodeText = useCallback(
    async (text: string) => {
      if (!text.trim() || text.trim().length < 5) return;

      setIsGeocoding(true);
      try {
        await loadGoogleMaps();
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({
          address: text,
          componentRestrictions: { country: "gb" },
        });

        if (response.results && response.results.length > 0) {
          const place = response.results[0];
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || text;

          processPlace({
            placeId: place.place_id || "",
            address,
            lat,
            lng,
          });
        }
      } catch (err) {
        console.warn("Geocoding failed for typed text:", err);
        // Don't block the user — they can still proceed
      } finally {
        setIsGeocoding(false);
      }
    },
    [processPlace]
  );

  // Init Google Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await loadGoogleMaps();
        if (!isMounted || !inputRef.current) return;

        const options: google.maps.places.AutocompleteOptions = {
          componentRestrictions: { country: "gb" },
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
        };

        // For city private hire, bias results toward Cardiff
        if (serviceType === "city") {
          options.bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(51.38, -3.35),
            new google.maps.LatLng(51.58, -3.0)
          );
          options.strictBounds = false;
        }

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          pickedFromDropdown.current = true;

          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Build a full address from components to avoid Google's shortened formatted_address
            const address = buildFullAddress(place);

            processPlace({
              placeId: place.place_id || "",
              address,
              lat,
              lng,
            });
          }
        });

        autocompleteRef.current = autocomplete;
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load Google Maps autocomplete:", err);
        setIsLoaded(true); // Allow manual input
      }
    };

    init();

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [serviceType, processPlace]);

  useEffect(() => {
    setInputValue(value?.address || "");
  }, [value]);

  /**
   * On blur: if the user typed/pasted text but didn't pick from dropdown,
   * geocode the text to get lat/lng.
   */
  const handleBlur = () => {
    // Small delay to allow place_changed to fire first (if user clicked dropdown)
    setTimeout(() => {
      if (pickedFromDropdown.current) {
        pickedFromDropdown.current = false;
        return;
      }

      const text = inputRef.current?.value || "";
      // Only geocode if we have text and no valid place yet, or if text changed
      if (text.trim() && (!value || value.address !== text)) {
        geocodeText(text);
      }
    }, 300);
  };

  /**
   * On Enter: geocode immediately instead of waiting for blur.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const text = inputRef.current?.value || "";
      if (text.trim() && (!value || value.address !== text)) {
        pickedFromDropdown.current = false;
        geocodeText(text);
      }
    }
  };

  const handleClear = () => {
    setInputValue("");
    setWarning("");
    onChange(null);
    onLocationWarning?.("");
    pickedFromDropdown.current = false;
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex flex-col gap-1">
      <div
        className={`w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 gap-3 transition-colors focus-within:border-gray-400 ${className}`}
      >
        {icon || (
          <MapPin className="w-[18px] h-[18px] text-brand-muted shrink-0" strokeWidth={2} />
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            pickedFromDropdown.current = false;
            if (!e.target.value) {
              onChange(null);
              setWarning("");
              onLocationWarning?.("");
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
          autoComplete="off"
        />
        {isGeocoding && (
          <Loader2 className="w-4 h-4 text-brand-muted animate-spin shrink-0" />
        )}
        {inputValue && !isGeocoding && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-brand-graphite" />
          </button>
        )}
      </div>

      {/* Cardiff-only warning */}
      {warning && (
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in slide-in-from-top-1">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[12px] text-amber-700 font-semibold leading-tight">
            {warning}
          </span>
        </div>
      )}
    </div>
  );
};
