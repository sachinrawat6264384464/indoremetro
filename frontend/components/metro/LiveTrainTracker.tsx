"use client";

import React, { useState, useEffect } from "react";
import { Train, Activity, MapPin, Gauge, Users, Thermometer, ShieldCheck, RefreshCw, Radio } from "lucide-react";

interface StationInfo {
  id: string;
  name: string;
  code: string;
}

const CORRIDOR_STATIONS: StationInfo[] = [
  { id: "st-01", name: "Gandhi Nagar", code: "ST01" },
  { id: "st-02", name: "Super Corridor 1", code: "ST02" },
  { id: "st-03", name: "Bhawarshala Square", code: "ST03" },
  { id: "st-04", name: "MR 10 Road", code: "ST04" },
  { id: "st-05", name: "ISBT / MR 10", code: "ST05" },
  { id: "st-06", name: "Bapat Square", code: "ST06" },
  { id: "st-07", name: "Vijay Nagar Square", code: "ST07" },
  { id: "st-08", name: "Radisson Square", code: "ST08" },
];

export function LiveTrainTracker() {
  const [selectedStationIdx, setSelectedStationIdx] = useState(5); // Bapat Square default
  const [uplineStationIdx, setUplineStationIdx] = useState(4); // Current train location
  const [downlineStationIdx, setDownlineStationIdx] = useState(6);
  const [uplineSeconds, setUplineSeconds] = useState(215); // 3m 35s
  const [downlineSeconds, setDownlineSeconds] = useState(140); // 2m 20s
  const [trainSpeed, setTrainSpeed] = useState(64);
  const [activeTab, setActiveTab] = useState<"UPLINE" | "DOWNLINE">("UPLINE");

  // Real-time 1-second ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setUplineSeconds((prev) => {
        if (prev <= 1) {
          setUplineStationIdx((idx) => (idx + 1) % CORRIDOR_STATIONS.length);
          return 300; // 5 min interval
        }
        return prev - 1;
      });

      setDownlineSeconds((prev) => {
        if (prev <= 1) {
          setDownlineStationIdx((idx) => (idx - 1 + CORRIDOR_STATIONS.length) % CORRIDOR_STATIONS.length);
          return 270;
        }
        return prev - 1;
      });

      // Fluctuate speed realistically between 58 km/h and 68 km/h
      setTrainSpeed(58 + Math.floor(Math.random() * 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const selectedStation = CORRIDOR_STATIONS[selectedStationIdx];
  const uplineNextStation = CORRIDOR_STATIONS[(uplineStationIdx + 1) % CORRIDOR_STATIONS.length];
  const downlineNextStation = CORRIDOR_STATIONS[(downlineStationIdx - 1 + CORRIDOR_STATIONS.length) % CORRIDOR_STATIONS.length];

  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Metro Train Telemetry</h3>
            <p className="text-xs text-slate-500 font-semibold">Real-time Automatic Train Operation (ATO) sensor feeds</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Live ATO Telemetry Active
          </span>
        </div>
      </div>

      {/* Upline / Downline Direction Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("UPLINE")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === "UPLINE"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Platform 1: Gandhi Nagar ➔ Radisson Sq</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DOWNLINE")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === "DOWNLINE"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Platform 2: Radisson Sq ➔ Gandhi Nagar</span>
        </button>
      </div>

      {/* Main Live Arrival Countdown Hero Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">SELECTED STATION TELEMETRY</span>
            <h4 className="text-2xl font-black text-white">{selectedStation.name} <span className="text-xs font-mono font-bold text-amber-400">({selectedStation.code})</span></h4>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">LIVE ARRIVAL COUNTDOWN</span>
            <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {activeTab === "UPLINE" ? formatTime(uplineSeconds) : formatTime(downlineSeconds)}
            </span>
          </div>
        </div>

        {/* Live Train Status & Speed Gauge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] flex items-center gap-1">
              <Train className="w-3.5 h-3.5 text-amber-400" /> Active Rake
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {activeTab === "UPLINE" ? "RAKE-301 (3-Car)" : "RAKE-308 (3-Car)"}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Cruising Speed
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{trainSpeed} km/h</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Rake Capacity
            </span>
            <span className="font-bold text-cyan-300 text-sm">38% (Moderate)</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-sky-400" /> Climate Control
            </span>
            <span className="font-bold text-sky-300 text-sm">22°C (Optimal)</span>
          </div>

        </div>
      </div>

      {/* Interactive Corridor Station Track Bar */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Interactive Priority Corridor Station Map (Click station to inspect)
          </span>
          <span className="text-[11px] text-slate-500 font-bold">Line 3 Priority Corridor</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-3 px-1 scrollbar-thin">
          {CORRIDOR_STATIONS.map((st, idx) => {
            const isSelected = idx === selectedStationIdx;
            const isTrainHere = activeTab === "UPLINE" ? idx === uplineStationIdx : idx === downlineStationIdx;

            return (
              <div key={st.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedStationIdx(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    isTrainHere
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105 animate-pulse"
                      : isSelected
                      ? "bg-slate-900 text-white border-slate-800 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  {isTrainHere ? (
                    <Train className="w-4 h-4 text-slate-950" />
                  ) : (
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                  )}
                  <span>{st.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isTrainHere ? "bg-slate-950 text-amber-400" : isSelected ? "bg-slate-800 text-amber-400" : "bg-slate-200 text-slate-700"
                  }`}>
                    {st.code}
                  </span>
                </button>

                {idx < CORRIDOR_STATIONS.length - 1 && (
                  <div className={`w-4 sm:w-6 h-1 rounded-full ${
                    idx < (activeTab === "UPLINE" ? uplineStationIdx : downlineStationIdx)
                      ? "bg-amber-500"
                      : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
