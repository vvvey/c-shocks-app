"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSearchParams } from "next/navigation";
import countries from "@/data/countries.json";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Helper to get coordinates
const getCountryCoords = (alpha3: string): [number, number] => {
  const country = countries.find((c) => c["alpha-3"] === alpha3);
  if (!country || country.longitude == null || country.latitude == null) {
    return [0, 0];
  }
  return [country.longitude, country.latitude];
};

const FlightMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Get URL query params
  const searchParams = useSearchParams();
  const fromCode = searchParams.get("from") || "USA";
  const toCode = searchParams.get("to") || "KHM";

  const ORIGIN = { code: fromCode, coords: getCountryCoords(fromCode) };
  const DEST = { code: toCode, coords: getCountryCoords(toCode) };

  const calculateOptimalZoom = (from: [number, number], to: [number, number]) => {
    const distance = Math.sqrt(
      Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2)
    );

    if (distance > 100) return 4;
    if (distance > 50) return 5;
    if (distance > 20) return 6;
    return 7;
  };

  const calculateBearing = (from: [number, number], to: [number, number]) => {
    const [lon1, lat1] = from;
    const [lon2, lat2] = to;

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);

    return (Math.atan2(y, x) * 180) / Math.PI + 360 % 360;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const start = {
      center: ORIGIN.coords,
      zoom: calculateOptimalZoom(ORIGIN.coords, DEST.coords),
      pitch: 15,
      bearing: 0,
    };

    const end = {
      center: DEST.coords,
      zoom: 14,
      bearing: calculateBearing(ORIGIN.coords, DEST.coords) + 90,
      pitch: 90,
    };

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/vvvey/cmeqbedf500ee01qn3e26guvq",
      interactive: false,
      ...start,
    });

    mapRef.current.on("style.load", () => {
      const map = mapRef.current!;

      // Fog / atmosphere
      map.setFog({
        color: "rgb(220, 159, 159)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.4,
      });

      // 3D terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 3 });

      // Highlight countries
      map.addSource("countries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });
      map.addLayer({
        id: "highlighted-countries",
        type: "fill",
        source: "countries",
        "source-layer": "country_boundaries",
        paint: { "fill-color": "#ffcc00", "fill-opacity": 0.8 },
        filter: ["in", "iso_3166_1_alpha_3", ORIGIN.code, DEST.code],
      });

      // Fly animation
      
      setTimeout(() => {
        map.flyTo({
          ...end,
          duration: 15000,
          curve: 1.9,
          speed: 0.6,
          essential: true,
        });
      }, 1500);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [fromCode, toCode]);

  return <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default FlightMap;
