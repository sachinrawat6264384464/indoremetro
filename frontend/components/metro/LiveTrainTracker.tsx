"use client";

import React, { useState, useEffect } from "react";
import { Train, Clock, ArrowRight, Activity, MapPin } from "lucide-react";

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
          return 7; // Reset to next train interval
        }
        return prev - 1;
      });
    }, 15000); // Speed up for demonstration

    return () => clearInterval(timer);
  }, [stations.length]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="text-base font-extrabold text-white">Live Metro Train Telemetry</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
          <Activity className="w-3 h-3" /> Live Tracking
        </span>
      </div>

      {/* Arrival Countdown Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-teal-500/10 border border-amber-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Next Train Arrival</span>
          <span className="text-2xl font-black text-amber-400">{stations[currentStationIdx]}</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-white font-mono">{nextTrainMins} min</span>
          <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-widest">Approaching Platform 1</span>
        </div>
      </div>

      {/* Visual Train Progress Line */}
      <div className="space-y-2 pt-2">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Priority Corridor Train Movement</span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-2">
          {stations.map((st, idx) => {
            const isCurrent = idx === currentStationIdx;
            const isPassed = idx < currentStationIdx;
            return (
              <div key={idx} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  isCurrent ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse" :
                  isPassed ? "bg-slate-800 text-slate-400 border-slate-700" :
                  "bg-slate-900/80 text-slate-300 border-slate-800"
                }`}>
                  {isCurrent ? <Train className="w-3.5 h-3.5" /> : <MapPin className="w-3 h-3" />}
                  <span>{st.split(" ")[0]}</span>
                </div>
                {idx < stations.length - 1 && (
                  <div className={`w-4 h-0.5 ${isPassed ? "bg-amber-500/60" : "bg-slate-800"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
