"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, Train, ChevronRight, Sparkles, CheckCircle2, Sliders, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "UNDER_CONSTRUCTION">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      setLoading(true);
      const res = await apiFetch<Station[]>("/stations");
      setLoading(false);
      if (res.success && res.data && res.data.length > 0) {
        setStations(res.data);
      } else {
        setStations(FALLBACK_STATIONS);
      }
    }
    fetchStations();
  }, []);

  const filtered = stations.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.hindi_name && s.hindi_name.includes(search)) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      (s.area && s.area.toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "ACTIVE") return matchesSearch && (s.status === "ACTIVE" || s.status === "OPERATIONAL");
    if (statusFilter === "UNDER_CONSTRUCTION") return matchesSearch && (s.status === "UNDER_CONSTRUCTION" || s.status === "UPCOMING");
    return matchesSearch;
  });

  const activeCount = stations.filter((s) => s.status === "ACTIVE" || s.status === "OPERATIONAL").length;
  const upcomingCount = stations.length - activeCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1500px] mx-auto space-y-8">
        
        {/* Header Bar & Search Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black shadow-sm mb-2">
                <Train className="w-4 h-4 text-amber-600 animate-pulse" /> Official MPMRCL Yellow Line Directory
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">All Indore Metro Stations</h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                Complete list of all 29 Indore Metro Yellow Line stations. Tap any station to view amenities, gates, fares, and nearby transport.
              </p>
            </div>

            {/* Filter Tabs & Search Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Status Tabs */}
              <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    statusFilter === "ALL"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({stations.length || 29})
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    statusFilter === "ACTIVE"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Operational ({activeCount || 16})
                </button>
                <button
                  onClick={() => setStatusFilter("UNDER_CONSTRUCTION")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    statusFilter === "UNDER_CONSTRUCTION"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Coming Soon ({upcomingCount || 13})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by name, code, or area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white text-xs font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Quick Line Specs Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">CORRIDOR</span>
              <span className="font-black text-slate-900 block text-sm">Line 3 (Yellow Line)</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider">OPERATIONAL STRETCH</span>
              <span className="font-black text-emerald-700 block text-sm">16 Stations Active</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">TOTAL LOOP DISTANCE</span>
              <span className="font-black text-slate-900 block text-sm">31.46 KM Ring Loop</span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-sky-900 tracking-wider">AIRPORT LINK</span>
              <span className="font-black text-sky-700 block text-sm">Underground Direct Shuttle</span>
            </div>
          </div>
        </div>

        {/* Clickable Station Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-500 font-bold">
            Fetching 29 stations from Indore Metro database...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((st, idx) => {
              const isOperational = st.status === "ACTIVE" || st.status === "OPERATIONAL";
              return (
                <Link
                  key={st.id}
                  href={`/stations/${st.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-amber-400 hover:shadow-lg cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Station Number Badge */}
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-black text-slate-900 text-sm shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      {st.station_number || idx + 1}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-base truncate group-hover:text-amber-600 transition-colors">
                          {st.name}
                        </h3>
                      </div>

                      {st.hindi_name && (
                        <p className="text-xs font-bold text-slate-500 truncate">{st.hindi_name}</p>
                      )}

                      <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{st.area || "Indore"}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-mono font-bold text-slate-700">{st.code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {isOperational ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Open now
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Coming soon
                      </span>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


