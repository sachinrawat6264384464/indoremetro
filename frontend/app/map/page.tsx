"use client";

import React, { useState, useEffect } from "react";
import { Station, JourneyPlan } from "@/types";
import { 
  fetchMetroGeoJSON, fetchMetroStatistics, fetchNearbyPlaces, 
  searchNearbyPlaces, GeoJSONCollection, MetroStatistics, NearbyPlaceItem 
} from "@/lib/api/metro";
import { apiFetch } from "@/lib/api";
import { MetroMap } from "@/components/metro-map/MetroMap";
import { MapSidebar } from "@/components/metro-map/MapSidebar";
import { JourneyDrawer } from "@/components/metro-map/JourneyDrawer";
import { toast } from "sonner";

import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";

export default function InteractiveMapPage() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONCollection | null>(null);
  const [stats, setStats] = useState<MetroStatistics | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceItem[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [journeyPlan, setJourneyPlan] = useState<JourneyPlan | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);

  useEffect(() => {
    async function initMapData() {
      const [geoRes, statsRes, stationsRes] = await Promise.all([
        fetchMetroGeoJSON(),
        fetchMetroStatistics(),
        apiFetch<Station[]>("/stations"),
      ]);

      if (geoRes.success && geoRes.data) setGeoJsonData(geoRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);

      const activeStations = (stationsRes.success && stationsRes.data && stationsRes.data.length > 0)
        ? stationsRes.data
        : FALLBACK_STATIONS;

      setStations(activeStations);
      const first = activeStations[0].id;
      const last = activeStations[activeStations.length - 1].id;
      setSourceId(first);
      setDestId(first !== last ? last : (activeStations[1]?.id || first));
      setSelectedStation(activeStations[0]);
    }

    initMapData();
  }, []);

  useEffect(() => {
    async function loadPlaces() {
      if (selectedStation) {
        const res = await fetchNearbyPlaces(selectedStation.id);
        if (res.success && res.data) {
          if (activeCategory !== "ALL") {
            setNearbyPlaces(res.data.filter((p) => p.category === activeCategory));
          } else {
            setNearbyPlaces(res.data);
          }
        }
      } else {
        const res = await searchNearbyPlaces("", activeCategory !== "ALL" ? activeCategory : undefined);
        if (res.success && res.data) setNearbyPlaces(res.data);
      }
    }
    loadPlaces();
  }, [selectedStation, activeCategory]);

  const handleSwapStations = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
  };

  const handleFindRoute = async () => {
    if (!sourceId || !destId) {
      toast.error("Please select source and destination stations");
      return;
    }
    if (sourceId === destId) {
      toast.error("Source and destination stations must be different");
      return;
    }

    setJourneyLoading(true);
    setJourneyPlan(null);

    const res = await apiFetch<JourneyPlan>("/journeys/plan", {
      method: "POST",
      body: JSON.stringify({
        source_station_id: sourceId,
        dest_station_id: destId,
      }),
    });

    setJourneyLoading(false);

    if (res.success && res.data) {
      setJourneyPlan(res.data);
      toast.success(`Route calculated! ${res.data.stop_count} stops (${res.data.estimated_time_mins} mins)`);
    } else {
      toast.error(res.message || res.error?.message || "Failed to plan route");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#070A12] p-4 flex flex-col justify-between">
      {/* Background GIS Map Canvas */}
      <div className="absolute inset-0 z-0 p-4">
        <MetroMap
          geoJsonData={geoJsonData}
          stations={stations}
          nearbyPlaces={nearbyPlaces}
          selectedStation={selectedStation}
          journeyPlan={journeyPlan}
          onSelectStation={(st) => setSelectedStation(st)}
          onSelectFrom={(st) => setSourceId(st.id)}
          onSelectTo={(st) => setDestId(st.id)}
          activeCategory={activeCategory}
        />
      </div>

      {/* Floating Sidebars Overlay */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        <MapSidebar
          stats={stats}
          stations={stations}
          nearbyPlaces={nearbyPlaces}
          selectedStation={selectedStation}
          onSelectStation={(st) => setSelectedStation(st)}
          activeCategory={activeCategory}
          onCategorySelect={(cat) => setActiveCategory(cat)}
        />
      </div>

      {/* Floating Bottom Journey Drawer Overlay */}
      <JourneyDrawer
        stations={stations}
        sourceId={sourceId}
        destId={destId}
        onSourceChange={(id) => setSourceId(id)}
        onDestChange={(id) => setDestId(id)}
        onSwap={handleSwapStations}
        onFindRoute={handleFindRoute}
        journeyResult={journeyPlan}
        loading={journeyLoading}
      />
    </div>
  );
}
