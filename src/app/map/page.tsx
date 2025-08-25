// /app/map/page.tsx
"use client"; // mark the page client-side

import React, { Suspense } from "react";
import FlightMap from "@/components/FlightMap";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <FlightMap  />
    </Suspense>
  );
}
