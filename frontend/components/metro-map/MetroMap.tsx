"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Station, JourneyPlan } from "@/types";
import { GeoJSONCollection, NearbyPlaceItem } from "@/lib/api/metro";
import { StationPopup } from "@/components/metro-map/StationPopup";
import { MapControls } from "@/components/metro-map/MapControls";

interface MetroMapProps {
  geoJsonData: GeoJSONCollection | null;
  stations: Station[];
  nearbyPlaces: NearbyPlaceItem[];
  selectedStation: Station | null;
  journeyPlan: JourneyPlan | null;
  onSelectStation: (st: Station) => void;
  onSelectFrom: (st: Station) => void;
  onSelectTo: (st: Station) => void;
  activeCategory: string;
}

export function MetroMap({
  geoJsonData,
  stations,
  nearbyPlaces,
  selectedStation,
  journeyPlan,
  onSelectStation,
  onSelectFrom,
  onSelectTo,
  activeCategory,
}: MetroMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const journeyLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [showPOIs, setShowPOIs] = useState(true);

  const defaultCenter: [number, number] = [22.748, 75.865]; // Indore Center
  const defaultZoom = 13;

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    if (!window.L) return;

    if (!mapInstanceRef.current) {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Indore Metro GIS',
        maxZoom: 19,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      journeyLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }
  }, [scriptLoadedSignal()]);

  function scriptLoadedSignal() {
    return typeof window !== "undefined" && !!window.L;
  }

  // Draw GeoJSON Route Lines
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !geoJsonData) return;
    const L = window.L;

    routeLayerRef.current.clearLayers();

    if (geoJsonData.lines_geojson || geoJsonData.features) {
      const lines = geoJsonData.lines_geojson || {
        type: "FeatureCollection",
        features: geoJsonData.features.filter((f) => f.geometry?.type === "LineString"),
      };

      L.geoJSON(lines, {
        style: (feature: any) => ({
          color: feature?.properties?.line_color || "#F59E0B",
          weight: 6,
          opacity: 0.85,
        }),
      }).addTo(routeLayerRef.current);
    }
  }, [geoJsonData, mapLoaded]);

  // Render Station Markers & POI Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    markersGroupRef.current.clearLayers();

    if (showStations) {
      stations.forEach((st) => {
        if (!st.latitude || !st.longitude) return;

        const isSelected = selectedStation?.id === st.id;
        const color = isSelected ? "#F59E0B" : "#0D9488";
        const radius = isSelected ? 10 : 7;

        const svgMarker = `
          <svg width="${radius * 2 + 4}" height="${radius * 2 + 4}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
            <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
          </svg>
        `;

        const customIcon = L.divIcon({
          html: svgMarker,
          className: "custom-station-marker",
          iconSize: [radius * 2, radius * 2],
          iconAnchor: [radius, radius],
        });

        const marker = L.marker([st.latitude, st.longitude], { icon: customIcon }).addTo(
          markersGroupRef.current
        );

        marker.on("click", () => {
          onSelectStation(st);
        });

        // Attach Popup
        const popupDiv = document.createElement("div");
        popupDiv.innerHTML = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0F172A;">
            <strong>${st.name} (${st.code})</strong><br/>
            <span style="color: #64748B;">${st.line_name} • ${st.status}</span>
          </div>
        `;
        marker.bindPopup(popupDiv);
      });
    }

    if (showPOIs) {
      nearbyPlaces.forEach((poi) => {
        if (!poi.latitude || !poi.longitude) return;

        const poiIcon = L.divIcon({
          html: `<div style="background:#0284C7; border:2px solid #FFF; width:12px; height:12px; border-radius:50%; shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: "poi-marker",
          iconSize: [12, 12],
        });

        const poiMarker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon }).addTo(
          markersGroupRef.current
        );

        poiMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <strong>${poi.name}</strong><br/>
            <span style="color:#0284C7;">${poi.category}</span>
          </div>
        `);
      });
    }
  }, [stations, nearbyPlaces, selectedStation, showStations, showPOIs, mapLoaded]);

  // Highlight Journey Route Path
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    journeyLayerRef.current.clearLayers();

    if (journeyPlan && journeyPlan.geojson_geometry) {
      const journeyGeoJson = L.geoJSON(journeyPlan.geojson_geometry, {
        style: {
          color: "#38BDF8",
          weight: 8,
          opacity: 0.9,
          dashArray: "10, 10",
        },
      }).addTo(journeyLayerRef.current);

      try {
        mapInstanceRef.current.fitBounds(journeyGeoJson.getBounds(), { padding: [50, 50] });
      } catch (e) {
        // Ignore fit bounds error if coordinates static
      }
    }
  }, [journeyPlan, mapLoaded]);

  // Center on Selected Station
  useEffect(() => {
    if (mapInstanceRef.current && selectedStation && selectedStation.latitude && selectedStation.longitude) {
      mapInstanceRef.current.setView([selectedStation.latitude, selectedStation.longitude], 15, {
        animate: true,
      });
    }
  }, [selectedStation]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.setView(defaultCenter, defaultZoom);
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = window.L;

        if (userMarkerRef.current) mapInstanceRef.current.removeLayer(userMarkerRef.current);

        userMarkerRef.current = L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: "#3B82F6",
          color: "#FFFFFF",
          weight: 3,
          fillOpacity: 1,
        })
          .addTo(mapInstanceRef.current)
          .bindPopup("Your Location")
          .openPopup();

        mapInstanceRef.current.setView([latitude, longitude], 15);
      },
      (err) => {
        console.warn("Geolocation permission error:", err);
      }
    );
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => setMapLoaded(true)}
      />

      <div className="relative w-full h-full min-h-[500px]">
        {/* Leaflet DOM Container */}
        <div ref={mapContainerRef} className="w-full h-full rounded-3xl z-10 bg-slate-950" />

        {/* Floating Map Controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onLocateUser={handleLocateUser}
          showStations={showStations}
          onToggleStations={() => setShowStations(!showStations)}
          showPOIs={showPOIs}
          onTogglePOIs={() => setShowPOIs(!showPOIs)}
        />
      </div>
    </>
  );
}
