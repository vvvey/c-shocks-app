"use client";

import { useRef, useEffect } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";
import { Button } from "@/components/ui/button";

export default function App() {
  const mapRef = useRef<MapRef>(null);

  const flyToCambodia = () => {
    mapRef.current?.flyTo({
      center: [105, 12], // Cambodia
      zoom: 6,
      duration: 2000
    });
  };

  // ✅ Wait 2 seconds and automatically fly to Cambodia
  useEffect(() => {
    const timer = setTimeout(() => {
      flyToCambodia();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="fixed inset-0 z-0">
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: 37.7751,
            longitude: -122.4193,
            zoom: 3
          }}
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          dragPan={false}
          scrollZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
        />
      </div>

      {/* Optional button if user wants to trigger again */}
      <div className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2">
        <Button
          onClick={flyToCambodia}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Fly to Cambodia
        </Button>
      </div>
    </div>
  );
}
