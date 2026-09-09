"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation, ArrowRightLeft, Sparkles, Clock, Ticket, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station, JourneyPlan } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";

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
        setDestId(active[12]?.id || active[1].id);
      }
    }
    loadStations();
  }, []);

  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
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

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Plan Your Metro Journey</h3>
            <p className="text-xs text-slate-500 font-medium">Select origin and destination stations</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Priority Corridor Active
        </span>
      </div>

      <form onSubmit={handlePlan} className="space-y-4">
        {/* Source Station */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">From Station</label>
          <div className="relative">
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-bold shadow-sm transition appearance-none cursor-pointer truncate"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Swap Button Divider */}
        <div className="relative flex justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <button
            type="button"
            onClick={handleSwap}
            className="relative z-10 px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
            title="Swap origin and destination"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
            <span>Swap Stations</span>
          </button>
        </div>

        {/* Dest Station */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">To Station</label>
          <div className="relative">
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-bold shadow-sm transition appearance-none cursor-pointer truncate"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-rose-800 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl font-medium">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
        >
          {loading ? "Calculating Route..." : "Plan Journey"}
        </button>
      </form>

      {/* Result Card */}
      {planResult && (
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-600 font-bold block">Stops</span>
              <span className="text-2xl font-extrabold text-slate-900">{planResult.stop_count} stops</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-600 font-bold block">Est. Duration</span>
              <span className="text-2xl font-extrabold text-emerald-600">~{planResult.estimated_time_mins} mins</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-600 font-bold block">Distance</span>
              <span className="text-2xl font-extrabold text-slate-900">{planResult.distance_km} km</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
              <span className="text-xs text-amber-800 font-extrabold block">Total Fare</span>
              <span className="text-2xl font-black text-amber-600">₹{planResult.fare_amount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-slate-700 font-medium">
                Route: <span className="font-bold text-slate-900">{planResult.route_name}</span> ({planResult.direction})
              </p>
            </div>
            <button
              onClick={handleBookTicket}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center justify-center gap-2 transition text-xs shadow-sm"
            >
              <Ticket className="w-4 h-4 text-amber-400" /> Book QR Ticket Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

