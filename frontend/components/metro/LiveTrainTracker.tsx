"use client";

import React, { useState, useEffect } from "react";
import { Train, Activity, MapPin } from "lucide-react";

export function LiveTrainTracker() {
  const [nextTrainMins, setNextTrainMins] = useState(4);
  const [currentStationIdx, setCurrentStationIdx] = useState(3);

  const stations = [
    "Devi Ahilya Bai Holkar Terminal",
    "Super Corridor 1",
    "Bhawarshala Square",
    "MR 10 Road",
    "ISBT / MR 10 Flyover",
    "Bapat Square",
    "Vijay Nagar Square",
    "Radisson Square",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNextTrainMins((prev) => {
        if (prev <= 1) {
          setCurrentStationIdx((sIdx) => (sIdx + 1) % stations.length);
          return 7;
        }
        return prev - 1;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, [stations.length]);

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="text-base font-extrabold text-slate-900">Live Metro Train Telemetry</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-600" /> Live Tracking
        </span>
      </div>

      {/* Arrival Countdown Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Next Train Arrival</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{stations[currentStationIdx]}</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-amber-600 font-mono">{nextTrainMins} min</span>
          <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-widest">Approaching Platform 1</span>
        </div>
      </div>

      {/* Visual Train Progress Line */}
      <div className="space-y-2 pt-2">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Priority Corridor Train Movement</span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-2">
          {stations.map((st, idx) => {
            const isCurrent = idx === currentStationIdx;
            const isPassed = idx < currentStationIdx;
            return (
              <div key={idx} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isCurrent ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm animate-pulse" :
                  isPassed ? "bg-slate-100 text-slate-500 border-slate-200" :
                  "bg-white text-slate-700 border-slate-200"
                }`}>
                  {isCurrent ? <Train className="w-3.5 h-3.5" /> : <MapPin className="w-3 h-3 text-slate-400" />}
                  <span>{st.split(" ")[0]}</span>
                </div>
                {idx < stations.length - 1 && (
                  <div className={`w-4 h-0.5 ${isPassed ? "bg-amber-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
