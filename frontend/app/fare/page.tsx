"use client";

import { useState, useEffect } from "react";
import { Calculator, Users, CheckCircle2, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Station, FareCalculation } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

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
      if (res.success && res.data && res.data.length > 0) {
        setStations(res.data);
        const first = res.data[0].id;
        const last = res.data[res.data.length - 1].id;
        setSourceId(first);
        setDestId(first !== last ? last : (res.data[1]?.id || first));
      }
    }
    loadStations();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceId || !destId) {
      toast.error("Please select both source and destination stations");
      return;
    }

    if (sourceId === destId) {
      toast.error("From Station and To Station must be different");
      return;
    }

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
      toast.success("Fare calculated successfully!");
    } else {
      toast.error(res.message || res.error?.message || "Failed to calculate fare");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-amber-600" /> Official Fare Calculator Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Metro Fare Calculator</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
            Calculate single and multi-passenger journey pricing based on official MPMRCL fare matrices.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">From Station</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">To Station</label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">Passengers</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                    className="w-full h-12 px-4 pl-10 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                  />
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Calculate Fare"}
            </button>
          </form>

          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-600 font-bold block">Stop Count</span>
                  <span className="text-2xl font-extrabold text-slate-900">{result.stop_count} stops</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-600 font-bold block">Base Fare / Person</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹{result.base_fare_per_passenger}</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
                  <span className="text-xs text-amber-800 font-extrabold block">Total ({passengerCount} Passengers)</span>
                  <span className="text-2xl font-black text-amber-600">₹{result.total_fare}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/book-ticket?source=${sourceId}&dest=${destId}&passengers=${passengerCount}`}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Ticket className="w-4 h-4 text-amber-400" /> Book Ticket Now &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Fare Matrix Rules Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Standard Indore Metro Fare Structure
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">0 to 3 Stops</p>
              <p className="text-lg font-extrabold text-slate-900">₹10</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">4 to 6 Stops</p>
              <p className="text-lg font-extrabold text-slate-900">₹20</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">7 to 10 Stops</p>
              <p className="text-lg font-extrabold text-slate-900">₹30</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">11+ Stops</p>
              <p className="text-lg font-extrabold text-slate-900">₹40</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
