"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation, ArrowRightLeft, Sparkles, Clock, Ticket, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station, JourneyPlan } from "@/types";

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
      if (res.success && res.data) {
        setStations(res.data);
        if (res.data.length >= 2) {
          setSourceId(res.data[0].id);
          setDestId(res.data[12]?.id || res.data[1].id);
        }
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
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Plan Your Metro Journey</h3>
            <p className="text-xs text-slate-400">Select origin and destination stations</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Priority Corridor Active
        </span>
      </div>

      <form onSubmit={handlePlan} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Source Station */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">From Station</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition"
              title="Swap stations"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Dest Station */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">To Station</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl metro-gradient-bg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-teal-500/20 transition disabled:opacity-50"
        >
          {loading ? "Calculating Route..." : "Plan Journey"}
        </button>
      </form>

      {/* Result Card */}
      {planResult && (
        <div className="mt-8 pt-6 border-t border-white/10 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-xs text-slate-400 block">Stops</span>
              <span className="text-2xl font-bold text-white">{planResult.stop_count} stops</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-xs text-slate-400 block">Est. Duration</span>
              <span className="text-2xl font-bold text-teal-400">~{planResult.estimated_time_mins} mins</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-xs text-slate-400 block">Distance</span>
              <span className="text-2xl font-bold text-slate-200">{planResult.distance_km} km</span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30">
              <span className="text-xs text-teal-300 block">Total Fare</span>
              <span className="text-2xl font-bold text-teal-300">₹{planResult.fare_amount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <p className="text-sm text-slate-200">
                Route: <span className="font-semibold text-white">{planResult.route_name}</span> ({planResult.direction})
              </p>
            </div>
            <button
              onClick={handleBookTicket}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition"
            >
              <Ticket className="w-4 h-4" /> Book QR Ticket Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
