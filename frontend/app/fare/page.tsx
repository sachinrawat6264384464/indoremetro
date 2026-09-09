"use client";

import { useState, useEffect } from "react";
import { Calculator, Users, CheckCircle2, Ticket, MapPin, ArrowRight, Zap, Train, Compass, ShieldCheck, Clock, ArrowRightLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Station, FareCalculation } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";

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
      const list = (res.success && res.data && res.data.length > 0) ? res.data : FALLBACK_STATIONS;
      setStations(list);
      if (list.length >= 2) {
        setSourceId(list[0].id);
        setDestId(list[list.length - 1]?.id || list[1].id);
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

  const sourceStation = stations.find((s) => s.id === sourceId);
  const destStation = stations.find((s) => s.id === destId);

  const fareTiers = [
    { min: 0, max: 3, label: "0 to 3 Stops", fare: 10, icon: Zap, color: "emerald", desc: "Short distance commute" },
    { min: 4, max: 6, label: "4 to 6 Stops", fare: 20, icon: Train, color: "blue", desc: "Mid corridor travel" },
    { min: 7, max: 10, label: "7 to 10 Stops", fare: 30, icon: Compass, color: "amber", desc: "Long city transit" },
    { min: 11, max: 99, label: "11+ Stops", fare: 40, icon: ShieldCheck, color: "purple", desc: "Full corridor pass" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1500px] mx-auto space-y-10">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black shadow-sm">
            <Calculator className="w-4 h-4 text-amber-600 animate-pulse" /> Official MPMRCL Fare Calculator Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Indore Metro <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Fare Calculator</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-bold leading-relaxed">
            Transparent fare computation for priority corridor Line 3. Select your origin & destination to view real-time ticket pricing.
          </p>

          {/* Popular Route Fast Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Quick Routes:</span>
            <button
              onClick={() => handleQuickSelect(0, 12)}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
            >
              Gandhi Nagar ➔ Vijay Nagar
            </button>
            <button
              onClick={() => handleQuickSelect(1, 14)}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
            >
              Super Corridor 1 ➔ Palasia
            </button>
            <button
              onClick={() => handleQuickSelect(3, 16)}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-sm transition hover:border-amber-400"
            >
              Bhavarkuan ➔ Airport
            </button>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleCalculate} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              
              {/* From Station */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> From Station
                </label>
                <div className="relative">
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full h-14 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-extrabold shadow-sm transition appearance-none cursor-pointer"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-12 h-12 rounded-2xl bg-amber-100 hover:bg-amber-500 text-amber-900 hover:text-slate-950 border border-amber-300 flex items-center justify-center shadow-md transition transform hover:rotate-180 duration-300"
                  title="Swap Origin & Destination"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* To Station */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> To Station
                </label>
                <div className="relative">
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full h-14 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-extrabold shadow-sm transition appearance-none cursor-pointer"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              {/* Passengers Count Selector */}
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Passengers
                </label>
                <div className="flex items-center h-14 bg-slate-50 border border-slate-300 rounded-2xl px-2">
                  <button
                    type="button"
                    onClick={() => setPassengerCount((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-black text-lg flex items-center justify-center shadow-sm border border-slate-200"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-slate-900 text-base">
                    {passengerCount} {passengerCount === 1 ? "Passenger" : "Pass"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengerCount((p) => Math.min(10, p + 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-black text-lg flex items-center justify-center shadow-sm border border-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Calculator className="w-5 h-5 text-slate-950" />
              {loading ? "Calculating Official Fare..." : "Calculate Fare Now"}
            </button>
          </form>

          {/* Interactive Fare Calculation Results */}
          {result && (
            <div className="pt-8 border-t border-slate-200 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Route Track Banner */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Calculated Journey Route</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    Yellow Line 3 Corridor
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-400 block">ORIGIN</span>
                    <span className="text-lg font-black text-white">{sourceStation?.name || "Source"}</span>
                    <span className="text-xs text-emerald-400 font-mono block font-bold">{sourceStation?.code}</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-4 w-full">
                    <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-400 mb-1">
                      <span>{result.stop_count} Intermediary Stops</span>
                      <span>Est. ~{result.stop_count * 2.5} Mins</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 relative overflow-hidden flex items-center">
                      <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full w-full animate-pulse" />
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-xs font-bold text-slate-400 block">DESTINATION</span>
                    <span className="text-lg font-black text-white">{destStation?.name || "Destination"}</span>
                    <span className="text-xs text-rose-400 font-mono block font-bold">{destStation?.code}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Intermediary Stops</span>
                  <span className="text-3xl font-black text-slate-900">{result.stop_count} Stops</span>
                  <p className="text-xs text-slate-500 font-medium">Distance fare bracket computed</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Base Fare per Person</span>
                  <span className="text-3xl font-black text-emerald-700">₹{result.base_fare_per_passenger}</span>
                  <p className="text-xs text-slate-500 font-medium">Standard single ticket rate</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-1 relative">
                  <span className="text-xs text-amber-900 font-black uppercase tracking-wider block">
                    Total Fare ({passengerCount} {passengerCount === 1 ? "Passenger" : "Passengers"})
                  </span>
                  <span className="text-4xl font-black text-amber-600">₹{result.total_fare}</span>
                  <span className="absolute top-4 right-4 text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                    Calculated
                  </span>
                </div>

              </div>

              {/* Action Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <h4 className="text-lg font-black tracking-tight">Ready to Commute?</h4>
                  <p className="text-xs font-extrabold text-slate-900 opacity-90">
                    Get your instant digital QR ticket directly on your mobile device.
                  </p>
                </div>
                <Link
                  href={`/book-ticket?source=${sourceId}&dest=${destId}&passengers=${passengerCount}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-105"
                >
                  <Ticket className="w-4 h-4 text-amber-400" /> Book QR Ticket Now &rarr;
                </Link>
              </div>

            </div>
          )}
        </div>

        {/* Official Indore Metro Fare Matrix Tier Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Official Indore Metro Fare Matrix Structure
              </h3>
              <p className="text-xs font-semibold text-slate-500">Government approved distance slabs for Priority Line 3</p>
            </div>
            <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              4 Fare Slabs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fareTiers.map((tier, idx) => {
              const Icon = tier.icon;
              const isCurrentActive = result && result.stop_count >= tier.min && result.stop_count <= tier.max;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 relative overflow-hidden ${
                    isCurrentActive
                      ? "bg-white border-2 border-amber-500 shadow-xl ring-4 ring-amber-500/10 scale-105"
                      : "bg-white border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  {isCurrentActive && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Active Route Tier
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      idx === 0 ? "bg-emerald-50 text-emerald-600" :
                      idx === 1 ? "bg-blue-50 text-blue-600" :
                      idx === 2 ? "bg-amber-50 text-amber-600" :
                      "bg-purple-50 text-purple-600"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">SLAB #{idx + 1}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">{tier.label}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{tier.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Fare Price</span>
                    <span className="text-3xl font-black text-slate-900">₹{tier.fare}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
