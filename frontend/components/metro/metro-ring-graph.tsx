"use client";

import React, { useState } from "react";
import { Station } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";
import { Train, RefreshCw, Info, MapPin, ArrowRightLeft, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";

interface MetroRingGraphProps {
  stations?: Station[];
}

export function MetroRingGraph({ stations = FALLBACK_STATIONS }: MetroRingGraphProps) {
  const activeStations = stations.length > 0 ? stations : FALLBACK_STATIONS;
  const [selectedStation, setSelectedStation] = useState<Station>(activeStations[0]);
  const [animateTrains, setAnimateTrains] = useState(true);

  // Calculate SVG circular positions for 16 stations around a 360-degree loop
  const total = activeStations.length;
  const radius = 170;
  const centerX = 250;
  const centerY = 250;

  const stationPositions = activeStations.map((st, i) => {
    // Start angle from top (-90 deg)
    const angle = ((i / total) * 360 - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...st, x, y, angle, order: i + 1 };
  });

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Ring Loop Schematic Graph
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Indore Yellow Line 3 Cyclic Ring Graph</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Interactive 360-degree loop network diagram showing continuous UP &amp; DOWN line connectivity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnimateTrains(!animateTrains)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
              animateTrains
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${animateTrains ? "animate-spin" : ""}`} />
            <span>{animateTrains ? "Live Trains Moving" : "Paused Animation"}</span>
          </button>
        </div>
      </div>

      {/* Main Ring Graph Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Circular Graph Area (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl overflow-hidden min-h-[460px]">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          {/* SVG Canvas */}
          <svg viewBox="0 0 500 500" className="w-full max-w-[440px] h-auto relative z-10">
            <defs>
              {/* Yellow Ring Gradient */}
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Circular Track Glow */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="12"
              strokeOpacity="0.2"
              filter="url(#glow)"
            />

            {/* Main Yellow Line Circular Track */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="6"
              strokeDasharray="8 4"
            />

            {/* Inner Directional Track (DOWN Line) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - 18}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            />

            {/* Animated Train Rakes along the Ring */}
            {animateTrains && (
              <>
                {/* UP Line Train (Clockwise) */}
                <circle r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" filter="url(#glow)">
                  <animateMotion
                    path={`M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX - 0.1} ${centerY - radius}`}
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* DOWN Line Train (Counter-Clockwise) */}
                <circle r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" filter="url(#glow)">
                  <animateMotion
                    path={`M ${centerX} ${centerY - (radius - 18)} A ${radius - 18} ${radius - 18} 0 1 0 ${centerX + 0.1} ${centerY - (radius - 18)}`}
                    dur="22s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {/* Center Loop Hub Label */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <circle r="48" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <text y="-8" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="900">
                INDORE
              </text>
              <text y="8" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
                RING LOOP
              </text>
              <text y="22" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="700">
                31.46 KM
              </text>
            </g>

            {/* Station Nodes around perimeter */}
            {stationPositions.map((pos) => {
              const isSelected = selectedStation?.id === pos.id;

              return (
                <g
                  key={pos.id}
                  onClick={() => setSelectedStation(pos)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Station Node Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "11" : "8"}
                    fill={isSelected ? "#F59E0B" : "#0F172A"}
                    stroke={isSelected ? "#FFFFFF" : "#F59E0B"}
                    strokeWidth="3"
                  />

                  {/* Station Order Text */}
                  <text
                    x={pos.x}
                    y={pos.y + 3}
                    textAnchor="middle"
                    fill={isSelected ? "#000000" : "#FFFFFF"}
                    fontSize="7"
                    fontWeight="900"
                  >
                    {pos.order}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Direction Legend Overlay */}
          <div className="flex items-center gap-6 mt-4 relative z-20 text-[11px] font-extrabold text-slate-300 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>UP Line (Clockwise)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <span>DOWN Line (Counter-Clockwise)</span>
            </span>
          </div>
        </div>

        {/* Station Details & Graph Info Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Selected Station Card */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono font-black text-xs border border-amber-300">
                STATION #{selectedStation.code || "ST01"}
              </span>
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE NODE
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">{selectedStation.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Yellow Line Priority Corridor Loop</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Latitude</span>
                <span className="font-mono font-extrabold text-slate-900">{selectedStation.latitude} N</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Longitude</span>
                <span className="font-mono font-extrabold text-slate-900">{selectedStation.longitude} E</span>
              </div>
            </div>

            {/* Amenities */}
            {selectedStation.amenities && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-extrabold text-slate-700 block">Available Station Amenities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStation.amenities.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/book-ticket?source=${selectedStation.id}`}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs text-center shadow-md transition"
              >
                Book QR Ticket from {selectedStation.name} &rarr;
              </Link>
            </div>
          </div>

          {/* Loop Metrics Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Continuous Ring Loop Architecture
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Indore Metro Yellow Line 3 operates as a continuous ring loop allowing seamless travel across Super Corridor, MR 10, Bapat Square, Vijay Nagar, Radisson, and Palasia.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
