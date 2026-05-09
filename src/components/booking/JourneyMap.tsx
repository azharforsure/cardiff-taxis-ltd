import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../../lib/google-maps";

interface JourneyMapProps {
  route: google.maps.DirectionsResult | null;
  className?: string;
}

export const JourneyMap = ({ route, className = "" }: JourneyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      await loadGoogleMaps();

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 51.4816, lng: -3.1791 }, // Cardiff center
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ saturation: -20 }],
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#e8e8e8" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#d4d4d4" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#c9d9ec" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        rendererRef.current = new google.maps.DirectionsRenderer({
          map: mapInstanceRef.current,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#0A0A0A",
            strokeWeight: 4,
            strokeOpacity: 0.9,
          },
          markerOptions: {
            zIndex: 100,
          },
        });
      }

      if (route && rendererRef.current) {
        rendererRef.current.setDirections(route);
      }
    };

    initMap();
  }, [route]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-[16px] md:rounded-[20px] overflow-hidden bg-brand-section ${className}`}
      style={{ minHeight: "300px" }}
    />
  );
};
