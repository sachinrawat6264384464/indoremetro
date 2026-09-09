"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Train, ArrowRight, MapPin, Clock, Navigation, Search, LayoutGrid, ListFilter, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Route } from "@/types";
import { FALLBACK_ROUTES } from "@/lib/data/fallback-stations";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"TIMELINE" | "GRID">("TIMELINE");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadRoutes() {
      setLoading(true);
      const res = await apiFetch<Route[]>("/routes");
      setLoading(false);
      if (res.success && res.data && res.data.length > 0) {
        setRoutes(res.data);
      } else {
        setRoutes(FALLBACK_ROUTES);
      }
    }
    loadRoutes();
  }, []);

  const activeRoute = routes[activeRouteIndex] || routes[0] || FALLBACK_ROUTES[0];

  const filteredStations = activeRoute?.route_stations?.filter((rs) =>
    rs.station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rs.station.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2">
              <Train className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Official Corridor Map
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Indore Metro Line &amp; Route Map</h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Interactive station sequence, travel times, and alignment map for Priority Corridor Yellow Line 3.</p>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("TIMELINE")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                viewMode === "TIMELINE"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Vertical Corridor View
            </button>
            <button
              onClick={() => setViewMode("GRID")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                viewMode === "GRID"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Station Grid View
            </button>
          </div>
        </div>

        {/* Direction Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* Direction Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {routes.map((rt, idx) => (
              <button
                key={rt.id || idx}
                onClick={() => setActiveRouteIndex(idx)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                  activeRouteIndex === idx
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>{rt.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">({rt.direction})</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search station in route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Route Stats Summary Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div>
              <span className="px-3 py-1 rounded-md text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 uppercase tracking-wider">
                {activeRoute?.code || "YL-3"}
              </span>
              <h2 className="text-2xl font-black text-white mt-2">{activeRoute?.name}</h2>
              <p className="text-xs text-amber-300 font-semibold">{activeRoute?.direction}</p>
            </div>
            <Link
              href="/map"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition shrink-0"
            >
              <MapPin className="w-4 h-4" /> Open Full Interactive GIS Map &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400 font-bold block uppercase mb-1">Total Stations</span>
              <span className="text-xl font-black text-amber-400">{activeRoute?.route_stations?.length || 16} Stations</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400 font-bold block uppercase mb-1">Corridor Distance</span>
              <span className="text-xl font-black text-white">22.5 km</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400 font-bold block uppercase mb-1">Total Travel Time</span>
              <span className="text-xl font-black text-emerald-400">~30 Mins</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400 font-bold block uppercase mb-1">Train Frequency</span>
              <span className="text-xl font-black text-amber-400">10 Mins Headway</span>
            </div>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === "TIMELINE" ? (
          
          /* MODE 1: Vertical Metro Corridor Timeline */
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-500" /> Sequential Corridor Stop Timeline
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                Showing {filteredStations.length} of {activeRoute?.route_stations?.length || 16} stations
              </span>
            </div>

            <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-8 sm:before:left-12 before:top-4 before:bottom-4 before:w-1.5 before:bg-amber-400 before:rounded-full">
              {filteredStations.map((rs, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === filteredStations.length - 1;
                const isInterchange = rs.station.name.includes("ISBT") || rs.station.name.includes("Vijay Nagar") || rs.station.name.includes("Palasia");

                return (
                  <div key={rs.id || idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 transition duration-200 shadow-sm group">
                    
                    {/* Glowing Track Node Indicator */}
                    <div className={`absolute -left-[37px] sm:-left-[45px] top-6 w-7 h-7 rounded-full border-4 flex items-center justify-center text-[10px] font-black shadow-md ${
                      isFirst || isLast
                        ? "bg-amber-500 border-amber-300 text-slate-950 ring-4 ring-amber-100"
                        : "bg-slate-900 border-amber-400 text-white"
                    }`}>
                      {rs.station_order}
                    </div>

                    {/* Station Info Left */}
                    <div className="space-y-1.5 pl-4 sm:pl-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-black text-xs border border-amber-300">
                          {rs.station.code}
                        </span>
                        {isFirst && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                            ORIGIN TERMINAL
                          </span>
                        )}
                        {isLast && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300">
                            DESTINATION TERMINAL
                          </span>
                        )}
                        {isInterchange && !isFirst && !isLast && (
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black border border-sky-300">
                            MAJOR TRANSIT HUB
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                        {rs.station.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" /> {rs.distance_from_start_km} km from origin
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" /> ~{rs.travel_time_mins} mins travel
                        </span>
                      </div>

                      {/* Amenities Badges */}
                      {rs.station.amenities && rs.station.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {rs.station.amenities.map((amenity, aIdx) => (
                            <span key={aIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-bold">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Right */}
                    <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/80">
                      <Link
                        href={`/book-ticket?source=${rs.station.id}`}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        Book Ticket &rarr;
                      </Link>
                      <Link
                        href={`/stations/${rs.station.id}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                      >
                        Details
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /* MODE 2: Responsive Station Matrix Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStations.map((rs) => (
              <div
                key={rs.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                      {rs.station_order}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
                      {rs.station.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{rs.station.name}</h3>

                  <div className="space-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> {rs.distance_from_start_km} km
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> ~{rs.travel_time_mins} mins
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link href={`/stations/${rs.station.id}`} className="text-xs font-bold text-slate-700 hover:text-slate-900">
                    Station Details
                  </Link>
                  <Link href={`/book-ticket?source=${rs.station.id}`} className="text-xs font-extrabold text-amber-600 hover:underline">
                    Book &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
    </div>
  );
}

