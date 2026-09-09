"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation, ArrowRightLeft, Sparkles, Clock, Ticket, CheckCircle2, MapPin, Leaf, Shield, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station, JourneyPlan } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";
import { StationSelect } from "@/components/ui/station-select";

export default function JourneyPlannerWidget() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<JourneyPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadStations() {
      const res = await apiFetch<Station[]>("/stations");
      const active = (res.success && res.data && res.data.length > 0) ? res.data : FALLBACK_STATIONS;
      setStations(active);
      if (active.length >= 2) {
        setSourceId(active[0].id);
        setDestId(active[active.length - 1]?.id || active[1].id);
      }
    }
    loadStations();
  }, []);

  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
  };

  const handleQuickSelect = (srcIndex: number, dstIndex: number) => {
    if (stations[srcIndex] && stations[dstIndex]) {
      setSourceId(stations[srcIndex].id);
      setDestId(stations[dstIndex].id);
    }
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPlanResult(null);

    if (sourceId === destId) {
      setErrorMsg("Source and Destination stations must be different.");
      return;
    }

    setLoading(true);
    const res = await apiFetch<JourneyPlan>("/journeys/plan", {
      method: "POST",
      body: JSON.stringify({
        source_station_id: sourceId,
        dest_station_id: destId,
      }),
    });
    setLoading(false);

    if (res.success && res.data) {
      setPlanResult(res.data);
    } else {
      setErrorMsg(res.error?.message || "Failed to plan journey");
    }
  };

  const handleBookTicket = () => {
    if (planResult) {
      router.push(`/book-ticket?source=${sourceId}&dest=${destId}`);
    }
  };

  const sourceStation = stations.find((s) => s.id === sourceId);
  const destStation = stations.find((s) => s.id === destId);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Widget Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-sm">
            <Navigation className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Plan Your Metro Journey</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Real-time route calculation & fare matrix computation</p>
          </div>
        </div>
        <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Priority Corridor Active (Line 3)
        </span>
      </div>

      {/* Quick Select Chips */}
      <div className="flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Quick Select:</span>
        <button
          type="button"
          onClick={() => handleQuickSelect(0, 12)}
          className="px-3 py-1 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
        >
          Gandhi Nagar ➔ Vijay Nagar
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(1, 14)}
          className="px-3 py-1 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
        >
          Super Corridor 1 ➔ Palasia
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(3, 16)}
          className="px-3 py-1 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
        >
          Bhavarkuan ➔ Airport
        </button>
      </div>

      {/* Selection Form */}
      <form onSubmit={handlePlan} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Source Station Card */}
          <div className="md:col-span-5 space-y-2 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> Origin Station
            </label>
            <StationSelect
              stations={stations}
              value={sourceId}
              onChange={setSourceId}
              iconColor="text-emerald-600"
              placeholder="Select Origin Station"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwap}
              className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-500 text-amber-900 hover:text-slate-950 border border-amber-300 flex items-center gap-2 shadow-md transition font-extrabold text-xs"
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden lg:inline">Swap</span>
            </button>
          </div>

          {/* Destination Station Card */}
          <div className="md:col-span-5 space-y-2 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" /> Destination Station
            </label>
            <StationSelect
              stations={stations}
              value={destId}
              onChange={setDestId}
              iconColor="text-rose-600"
              placeholder="Select Destination Station"
            />
          </div>

        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-sm text-rose-900 bg-rose-50 border border-rose-300 px-4 py-3 rounded-2xl font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <Navigation className="w-5 h-5 text-slate-950" />
          {loading ? "Computing Optimal Route..." : "Plan Journey Now"}
        </button>
      </form>

      {/* Visual Journey Result Display */}
      {planResult && (
        <div className="pt-8 border-t border-slate-200 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 relative z-10">
          
          {/* Visual Route Line Track Header */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Route Overview: {planResult.route_name}</span>
              </div>
              <span className="text-xs font-extrabold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                Direction: {planResult.direction}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">DEPARTURE</span>
                <span className="text-xl font-black text-white">{sourceStation?.name || "Origin"}</span>
                <span className="text-xs text-slate-400 font-mono block font-bold">{sourceStation?.code}</span>
              </div>

              <div className="flex-1 flex flex-col items-center px-4 w-full">
                <div className="flex items-center justify-between w-full text-xs font-bold text-slate-400 mb-2">
                  <span>{planResult.stop_count} Stops ({planResult.distance_km} km)</span>
                  <span>~{planResult.estimated_time_mins} mins</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 relative overflow-hidden flex items-center">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full w-full animate-pulse" />
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block">ARRIVAL</span>
                <span className="text-xl font-black text-white">{destStation?.name || "Destination"}</span>
                <span className="text-xs text-slate-400 font-mono block font-bold">{destStation?.code}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block">Intermediate Stops</span>
              <span className="text-2xl font-black text-slate-900">{planResult.stop_count} Stops</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
              <span className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider block">Est. Duration</span>
              <span className="text-2xl font-black text-emerald-700">~{planResult.estimated_time_mins} mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block">Distance</span>
              <span className="text-2xl font-black text-slate-900">{planResult.distance_km} km</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-1">
              <span className="text-xs text-amber-900 font-black uppercase tracking-wider block">Standard Fare</span>
              <span className="text-3xl font-black text-amber-600">₹{planResult.fare_amount}</span>
            </div>

          </div>

          {/* Green Commute Badge & Booking CTA */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Eco-Friendly Commute</p>
                <p className="text-xs text-slate-500 font-bold">Saving ~{(planResult.distance_km * 0.15).toFixed(1)}kg CO2 vs road traffic</p>
              </div>
            </div>

            <button
              onClick={handleBookTicket}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-md hover:scale-105"
            >
              <Ticket className="w-4 h-4 text-amber-400" /> Book QR Ticket Now &rarr;
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
