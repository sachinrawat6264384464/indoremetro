"use client";

import React, { useState } from "react";
import { Station } from "@/types";
import { MetroStatistics, NearbyPlaceItem } from "@/lib/api/metro";
import { 
  Train, MapPin, Search, Navigation, Layers, ShieldCheck, 
  Building2, Bus, Plane, ShoppingBag, Utensils, Hotel, Sparkles, ChevronRight 
} from "lucide-react";

interface MapSidebarProps {
  stats: MetroStatistics | null;
  stations: Station[];
  nearbyPlaces: NearbyPlaceItem[];
  selectedStation: Station | null;
  onSelectStation: (st: Station) => void;
  onSelectPOI?: (poi: NearbyPlaceItem) => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
}

export function MapSidebar({
  stats,
  stations,
  nearbyPlaces,
  selectedStation,
  onSelectStation,
  onSelectPOI,
  activeCategory,
  onCategorySelect,
}: MapSidebarProps) {
  const [stationSearch, setStationSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"STATIONS" | "PLACES">("STATIONS");

  const filteredStations = stations.filter(
    (st) =>
      st.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.code.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const categories = [
    { label: "All", value: "ALL", icon: Layers },
    { label: "Airport", value: "Airport", icon: Plane },
    { label: "Bus Stand", value: "Bus Stand", icon: Bus },
    { label: "Shopping / Mall", value: "Mall / Shopping", icon: ShoppingBag },
    { label: "Hotel", value: "Hotel", icon: Hotel },
    { label: "Restaurant", value: "Restaurant", icon: Utensils },
    { label: "Tourist Place", value: "Tourist Place", icon: Sparkles },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full pointer-events-none">
      
      {/* Left Sidebar: Branding & Metro Statistics */}
      <div className="w-full lg:w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between pointer-events-auto space-y-6">
        <div>
          {/* Header Branding */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Train className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">
                INDORE <span className="text-amber-400">METRO GIS</span>
              </h3>
              <p className="text-[10px] text-amber-400/90 font-semibold tracking-wider uppercase">
                Interactive Corridor Network
              </p>
            </div>
          </div>

          {/* Network Statistics Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Stations</span>
              <span className="text-xl font-extrabold text-white">{stats?.total_stations || 16}</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Operational</span>
              <span className="text-xl font-extrabold text-emerald-400">{stats?.operational_stations || 16}</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-amber-400 block uppercase font-semibold">Active Lines</span>
              <span className="text-xl font-extrabold text-amber-400">{stats?.total_lines || 2}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Network Length</span>
              <span className="text-xl font-extrabold text-slate-200">{stats?.priority_corridor_length_km || 17.5} km</span>
            </div>
          </div>

          {/* POI Category Filters */}
          <div className="mt-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nearby Landmark Filters</h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => onCategorySelect(cat.value)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                        : "bg-slate-950/80 text-slate-300 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Real-time GIS route alignment synchronized with MPMRCL</span>
        </div>
      </div>

      {/* Right Sidebar: Stations & Places List */}
      <div className="w-full lg:w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col pointer-events-auto max-h-[600px] overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab("STATIONS")}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "STATIONS"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Stations ({stations.length})
          </button>
          <button
            onClick={() => setActiveTab("PLACES")}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PLACES"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Landmarks ({nearbyPlaces.length})
          </button>
        </div>

        {activeTab === "STATIONS" ? (
          <div className="flex-1 flex flex-col overflow-hidden space-y-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search stations..."
                value={stationSearch}
                onChange={(e) => setStationSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredStations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => onSelectStation(st)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500/50 text-white"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20">
                        {st.code}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold group-hover:text-amber-400 transition-colors">
                          {st.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">{st.line_name}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {nearbyPlaces.length > 0 ? (
              nearbyPlaces.map((poi) => (
                <div
                  key={poi.id}
                  onClick={() => onSelectPOI && onSelectPOI(poi)}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400">{poi.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                      {poi.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{poi.address || "Indore landmark"}</p>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Distance: {poi.distance_km} km
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-8">
                No nearby places found for selected category.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
