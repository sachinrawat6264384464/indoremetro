"use client";

import { useState, useEffect } from "react";
import { Calculator, Users, CheckCircle2, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Station, FareCalculation } from "@/types";

export default function FarePage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FareCalculation | null>(null);

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

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await apiFetch<FareCalculation>("/fares/calculate", {
      method: "POST",
      body: JSON.stringify({
        source_station_id: sourceId,
        dest_station_id: destId,
        passenger_count: passengerCount,
      }),
    });

    setLoading(false);
    if (res.success && res.data) {
      setResult(res.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5" /> Official Fare Calculator Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Metro Fare Calculator</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Calculate single and multi-passenger journey pricing based on official MPMRCL fare matrices.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">From Station</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
              >
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">To Station</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
              >
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Passengers</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                  className="w-full h-12 px-4 pl-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate Fare"}
          </button>
        </form>

        {result && (
          <div className="mt-8 pt-6 border-t border-white/10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <span className="text-xs text-slate-400 block">Stop Count</span>
                <span className="text-2xl font-bold text-white">{result.stop_count} stops</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <span className="text-xs text-slate-400 block">Base Fare / Person</span>
                <span className="text-2xl font-bold text-teal-400">₹{result.base_fare_per_passenger}</span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30">
                <span className="text-xs text-teal-300 block">Total Fare ({result.passenger_count} Passenger)</span>
                <span className="text-3xl font-extrabold text-teal-300">₹{result.total_fare}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/book-ticket?source=${sourceId}&dest=${destId}`)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 transition"
              >
                <Ticket className="w-4 h-4" /> Proceed to Book Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fare Matrix Rules Info */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400" /> Standard Indore Metro Fare Structure
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <p className="text-xs text-slate-400">0 to 3 Stops</p>
            <p className="text-lg font-bold text-teal-400">₹10</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <p className="text-xs text-slate-400">4 to 6 Stops</p>
            <p className="text-lg font-bold text-teal-400">₹20</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <p className="text-xs text-slate-400">7 to 10 Stops</p>
            <p className="text-lg font-bold text-teal-400">₹30</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <p className="text-xs text-slate-400">11+ Stops</p>
            <p className="text-lg font-bold text-teal-400">₹40</p>
          </div>
        </div>
      </div>
    </div>
  );
}
